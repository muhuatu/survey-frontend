import { Component } from '@angular/core';
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
  ],
  templateUrl: './question-settings.component.html',
  styleUrl: './question-settings.component.scss',
})
export class QuestionSettingsComponent {
  // --------------------------- 宣告變數 --------------------------- //

  // 問卷
  name!: string;
  description!: string;
  startDate!: string;
  endDate!: string;

  // 問題
  questionArray: Question[] = [];
  title!: string;
  type!: string; // 單選、多選、簡答
  options: Array<any> = []; // 問題集
  necessary = false;
  checkbox = false;

  // 判斷
  editId: number | null = null; // 用來儲存當前正在編輯的問題 ID
  private nextID = 1; // 用來自增編號的變數
  isEditing = false; // 旗標變數：判斷是否處於編輯狀態
  defaultDate = ''; // 預設日期(今日)

  constructor(
    private router: Router,
    private dateService: DateService,
    private questService: QuestService
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

    // 判斷 1.新開啟(無資料) 2.從預覽頁回來(將資料帶回去)
    if (!this.questService.questData) {
      // 無資料的話會使用方法紀錄答案
      this.saveSurveyData();
    } else {
      // 有資料的話會帶入原本的填寫框
      const q = this.questService.questData;
      this.name = q.name;
      this.description = q.description;
      this.startDate = q.startDate;
      this.endDate = q.endDate;
      // 不需要用新陣列接收，因為 mat-table 的 dataSource 是吃 questionArray 資料
      // 若用新陣列接收，從預覽頁回來後，將導致表格無法渲染資料
      this.questionArray = q.questionArray;
      this.options = this.options;
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

  // --------------------------- 問題 --------------------------- //

  // 添加選項
  addOption() {
    if (this.type === 'S' || this.type === 'M') {
      this.options.push({ answer: '' });
      // 不可直接 push ''，因為這樣無法放入資料
      // 必須改為 {} object 格式，當作一個容器去接收新資料
    }
  }

  // 刪除選項
  removeOption(index: number) {
    this.options.splice(index, 1); // 刪除 index 後一個元素，例如索引0就是刪除第1個元素
  }

  // 增加問題
  addQuestion() {
    // 1. 檢查必填：如果有任何一個欄位是空的，則會返回
    if (!this.title || !this.type) {
      alert('⚠️ 請填寫問題名稱與類型');
      return;
    }
    if (
      (this.type === 'S' || this.type === 'M') &&
      (!this.options || this.options.length === 0)
    ) {
      alert('✍️ 單選或複選必須輸入選項');
      return;
    }
    if (this.type === 'M' && this.options.length < 2) {
      // 如果是多選，選項必須兩個以上。
      alert('✍️ 多選題選項必須填入兩個以上');
      return;
    }
    for (const item of this.options) {
      if (!item.answer) {
        alert('✍️ 選項不可為空白');
        return;
      }
    }

    // 2. 創建新問題對象
    const newQuestion: Question = {
      checkbox: false,
      questionId: this.isEditing ? this.editId! : this.nextID++, // 由旗標變數判斷用哪個id
      // 後面加 ! 是告訴 TS 這個變數一定不會是 null 或 undefined
      title: this.title,
      type: this.type,
      necessary: this.necessary,
      options: this.options,
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

    // 5. 重新排序
    this.reorderQuestions();

    // 6. 重置狀態
    this.isEditing = false;
    this.editId = null;

    // 7. 在更新問題後重新賦值 questions 陣列(沒加的話表格不會更新)
    this.questionArray = [...this.questionArray];
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
    this.options = editQuestion.options;

    // 3. 設定狀態
    this.isEditing = true;
    this.editId = id;
  }

  // 刪除單數問題
  deleteQuestion(id: number) {
    if (confirm('確定要刪除嗎？')) {
      this.questionArray = this.questionArray.filter(
        (question) => question.questionId !== id
      );
      // 把 questions 中不符合 需刪除ID 的問題都放入新陣列 (表示去除該刪除的ID)
    }
    this.reorderQuestions();
  }

  // 刪除複數問題
  deleteQuestions() {
    if (confirm('確定要刪除嗎？')) {
      this.questionArray = this.questionArray.filter(
        (question) => !question.checkbox
      );
      this.reorderQuestions();
    }
  }

  // 重新編號
  reorderQuestions(): void {
    this.questionArray.forEach(
      (question, index) => (question.questionId = index + 1)
    );
    // 從問題的索引 0 開始遍歷，並將 id 改為 索引+1 ==> 重新編號
  }

  // --------------------------- 資料傳遞 --------------------------- //

  // 儲存資料
  saveSurveyData() {
    const surveyToSubmit = {
      // 問卷
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
  }

  // 提交到預覽頁面
  submitToCheck() {
    if (this.checkNecessary()) {
      this.saveSurveyData();
      this.router.navigate(['/check']);
    }
  }

  // 檢查必填邏輯
  checkNecessary(): boolean {
    if (!this.name || !this.description || !this.startDate || !this.endDate) {
      alert('✍️ 問卷欄位皆為必填');
      return false;
    }
    if (!this.questionArray || this.questionArray.length === 0) {
      alert('⚠️ 請設定問題');
      return false;
    }
    return true;
  }

  // 禁止通行!!
  ban() {
    alert('⚠️ 請注意：問卷設定尚未完成，無法訪問此連結。');
    return;
  }
}
