import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { Question } from '../../@interface/Question';
import { DateService } from '../../@service/date-service';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../@service/quest-service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoadingService } from '../../@service/loading-service';
import { HttpClientService } from '../../http-service/http-client.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../@service/dialog.service';

@Component({
  selector: 'app-question-settings',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    MatRadioModule,
    CommonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './question-settings.component.html',
  styleUrl: './question-settings.component.scss',
})
export class QuestionSettingsComponent {
  // --------------------------- 宣告變數 --------------------------- //

  // 問卷
  quizId!: number;
  name!: string;
  description!: string;
  startDate!: string;
  endDate!: string;
  //published!: boolean;

  // 問題
  questionArray: Question[] = [];
  title!: string;
  type!: string; // 單選、多選、簡答
  options: Array<any> = []; // 問題集
  necessary = false;
  checkbox = false;

  // 判斷
  editId: number | null = null; // 用來儲存當前正在編輯的問題 ID
  private nextID = 1; // 用來自增編號的問題變數
  isEditing = false; // 旗標變數：判斷是否處於編輯狀態
  isNew = true;
  defaultDate = ''; // 預設日期(今日)

  constructor(
    private router: Router,
    private dateService: DateService,
    private questService: QuestService,
    private cdr: ChangeDetectorRef,
    private http: HttpClientService,
    private loading: LoadingService,
    public dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  // 表格顯示的欄位
  displayedColumns: string[] = [
    'checkbox',
    'questionId',
    'title',
    'options',
    'type',
    'necessary',
    'actions',
  ];

  // --------------------------- 日期、路由、初始化 --------------------------- //

  ngOnInit(): void {
    // 日期設定
    this.defaultDate = this.dateService.changeDateFormat();

    // 如果不加這段，新增選項的功能無法使用
    if (!this.questService.questData) {
      this.saveSurveyData();
    } else {
      // 確保 questionArray 是陣列
      if (!Array.isArray(this.questService.questData.questionArray)) {
        this.questService.questData.questionArray = [];
      }
    }

    // 1.從預覽頁回來(前端有資料,ID=0) 2.從首頁進來編輯(後端有資料,有ID)
    if (this.questService.questData) {
      this.quizId = this.questService.questData.id || 0;
      //console.log('問卷ID：' + this.quizId);
      this.isExistingSurvey();
    } else {
      // 3.新增問卷(無資料,ID=0)
      this.isNewSurvey();
    }
  }

  // 判斷"結束日期"不可小於"開始日期"
  checkEndDate(startDate: string): void {
    // 1. 賦值給開始日期
    this.startDate = startDate;
    // 2. 判斷
    if (this.endDate < this.startDate) {
      this.endDate = this.startDate; // 如果END小於START就讓它們相等囉!!
    }
  }

  // 編輯問卷
  isExistingSurvey() {
    const q = this.questService.questData;
    if (q.id > 0) {
      // 從首頁進來編輯(後端有資料, 有ID)
      this.loadFromBackend(q.id);
    } else {
      // 從預覽頁回來(前端有資料, ID=0)
      this.loadFromCheck(q);
    }
  }

  // 新增問卷
  isNewSurvey(): void {
    // 新增問卷(無資料, ID=0)
    const newSurvey = {
      quizId: 0,
      name: '',
      description: '',
      startDate: this.defaultDate,
      endDate: '',
      questionArray: [],
    };
    this.questService.questData = newSurvey;
    this.saveSurveyData();
  }

  // 從後端載入問卷資料
  loadFromBackend(quizId: number): void {
    // 獲取問卷ID
    const req = {
      id: quizId,
    };
    // 用API獲取問卷資料
    this.loading.show();
    this.http
      .postApi('http://localhost:8080/admin/search_quiz', req)
      .subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            this.questService.questData = {
              quizId: res.id,
              name: res.name,
              description: res.description,
              startDate: res.start_date,
              endDate: res.end_date,
              published: res.published,
              questionArray: res.question_list.map((q: any) => ({
                questionId: q.question_id,
                title: q.title,
                type: q.type,
                necessary: q.necessary,
                options: JSON.parse(q.option_list).map(
                  (item: { option: any; optionNumber: any }) => ({
                    option: item.option,
                    optionNumber: Number(item.optionNumber), // 轉回數字
                  })
                ),
              })),
            };
            console.log('我是來自後端的資料：', this.questService.questData);
            this.refreshFormData(); // 資料載入後刷新表單
          }
          this.loading.hide();
        },
        error: (err) => {
          console.error('問卷載入錯誤', err);
          this.loading.hide();
        },
      });
  }

  // 從預覽頁載入問卷資料
  loadFromCheck(q: any): void {
    q = this.questService.questData;
    this.quizId = 0;
    this.name = q.name;
    this.description = q.description;
    this.startDate = q.startDate;
    this.endDate = q.endDate;
    this.questionArray = q.questionArray;
    // 註解
    // 不需要用新陣列接收問題，因為 mat-table 的 dataSource 是吃 questionArray 資料
    // 若用新陣列接收，從預覽頁回來後，將導致表格無法渲染資料
  }

  // 刷新表單資料
  // 如果不寫：畫面上顯示的資料仍然是空的或舊的，因為模板上的綁定屬性（如 name, description 等）沒有被更新。
  refreshFormData(): void {
    const q = this.questService.questData;
    this.name = q.name;
    this.description = q.description;
    this.startDate = q.startDate;
    this.endDate = q.endDate;
    this.questionArray = q.questionArray;
  }

  // --------------------------- 問題 --------------------------- //

  // 添加選項
  addOption() {
    if (!Array.isArray(this.questionArray)) {
      this.questionArray = [];
    }
    if (!this.type) {
      this.type = 'S'; // 默認單選
    }
    if (this.type === 'S' || this.type === 'M') {
      this.options.push({ answer: '' });
    }
  }

  // 刪除選項
  removeOption(index: number) {
    this.options.splice(index, 1); // 刪除 index 後一個元素，例如索引0就是刪除第1個元素
  }

  // 檢查問題必填
  checkQuestionNecessary(): boolean {
    if (!this.title || !this.type) {
      this.dialogService.showAlert('⚠️ 請填寫問題名稱與類型');
      return false;
    }

    if ((this.type === 'S' || this.type === 'M') && this.options.length === 0) {
      this.dialogService.showAlert('✍️ 單選或多選必須輸入選項');
      return false;
    }

    if (this.type === 'M' && this.options.length < 2) {
      this.dialogService.showAlert('✍️ 多選題選項必須填入兩個以上');
      return false;
    }

    for (let option of this.options) {
      if (option.answer === '') {
        this.dialogService.showAlert('⚠️ 選項答案不能為空白');
        return false;
      }
    }

    return true;
  }

  // 增加問題 與 編輯問題 共用
  addQuestion() {
    // 1. 檢查必填：如果有任何一個欄位是空的，則會返回
    if (this.checkQuestionNecessary()) {
      // 2. 創建新問題對象
      const newQuestion: Question = {
        checkbox: false,
        questionId: this.isEditing ? this.editId! : this.nextID++, // 由旗標變數判斷用哪個id
        // 後面加 ! 是告訴 TS 這個變數一定不會是 null 或 undefined
        title: this.title,
        type: this.type,
        necessary: this.necessary,
        options:
          this.type === 'T'
            ? []
            : Array.isArray(this.options)
            ? this.options.map((option) => ({
                option: option.answer || option || '',
                optionNumber: this.options.indexOf(option) + 1,
              }))
            : [],
      };

      // 3. 更新問題列表
      if (this.isEditing) {
        // 3-1. 找出問題的索引，編輯時，將新問題陣列賦值給該索引的問題
        const index = this.questionArray.findIndex(
          (q) => q.questionId === newQuestion.questionId
        );
        this.questionArray[index] = newQuestion;
      } else {
        // 3-2. 新增時，直接在陣列後加上新問題
        this.questionArray = [...this.questionArray, newQuestion];
      }

      // 4. 點選新增後，清空輸入框
      this.title = '';
      this.type = '';
      this.necessary = false;
      this.options = [];

      // 5. 編號重新排序
      this.reorderQuestions();

      // 6. 重置狀態
      this.isEditing = false;
      this.editId = null;

      // 7. 在更新問題後重新賦值 questions 陣列(沒加的話表格不會更新ㄛ)
      this.questionArray = [...this.questionArray];
    }
  }

  // 編輯問題
  editQuestion(id: number) {
    // 1. 找出 questions 陣列中和 參數id 相符的索引
    const index = this.questionArray.findIndex(
      (question) => question.questionId === id
    );
    const editQuestion = this.questionArray[index];

    // 2. 填入問題
    this.title = editQuestion.title;
    this.type = editQuestion.type;
    this.necessary = editQuestion.necessary;
    this.options = editQuestion.options.map((option) => ({
      answer: option.option,
    }));

    // 3. 設定狀態
    this.isEditing = true;
    this.editId = id;
  }

  // 刪除單數問題
  deleteQuestion(id: number) {
    this.dialogService.showDialogWithCallback(
      '確認刪除',
      '您確定要刪除此問題嗎？',
      () => {
        this.questionArray = this.questionArray.filter(
          (question) => question.questionId !== id
        );
        // 把 questions 中不符合 需刪除ID 的問題都放入新陣列 (表示去除該刪除的ID)
        this.reorderQuestions();
      }
    );
  }

  // 刪除複數問題
  deleteQuestions() {
    this.dialogService.showDialogWithCallback(
      '確認刪除',
      '您確定要刪除此問題嗎？',
      () => {
        this.questionArray = this.questionArray.filter(
          (question) => !question.checkbox
        );
        this.reorderQuestions();
      }
    );
  }

  // 重新編號
  reorderQuestions(): void {
    this.questionArray.forEach(
      (question, index) => (question.questionId = index + 1)
    );
    // 從問題的索引 0 開始遍歷，並將 id 改為 索引+1 ==> 重新編號
  }

  // --------------------------- 資料傳遞 --------------------------- //

  // 儲存資料 -> 因為寫在同一頁所以可以全存
  saveSurveyData() {
    if (!Array.isArray(this.questionArray)) {
      this.questionArray = []; // 如果不是陣列，初始化為空陣列
    }

    for (const question of this.questionArray) {
      if (question.options) {
        // 調整每個選項的結構
        question.options = question.options.map(
          (option: any, index: number) => ({
            option: option.answer || option.option, // 將 answer 的值移到 option 屬性
            optionNumber: index + 1, // 選項編號
          })
        );
      }
    }

    const surveyToSubmit = {
      // 問卷
      quizId: this.quizId || 0,
      name: this.name,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      // 問題
      questionArray: this.questionArray.map((q) => ({
        questionId: q.questionId,
        title: q.title,
        type: q.type,
        necessary: q.necessary,
        options: q.options,
      })),
    };
    this.questService.questData = surveyToSubmit;
    console.log('儲存資料:', surveyToSubmit);
  }

  // 提交到預覽頁面
  submitToCheck() {
    if (this.checkNecessary()) {
      this.saveSurveyData();
      (this.quizId = this.questService.questData.quizId),
        this.router.navigate(['/check', this.quizId]);
    }
  }

  // 檢查必填邏輯
  checkNecessary(): boolean {
    if (!this.name || !this.description || !this.startDate || !this.endDate) {
      this.dialogService.showAlert('✍️ 問卷欄位皆為必填');
      return false;
    }
    if (!this.questionArray || this.questionArray.length === 0) {
      this.dialogService.showAlert('⚠️ 請設定問題');
      return false;
    }
    return true;
  }

  // 禁止通行!!
  ban() {
    this.dialogService.showAlert(
      '⚠️ 請注意：問卷設定尚未完成，無法訪問此連結。'
    );
    return;
  }
}
