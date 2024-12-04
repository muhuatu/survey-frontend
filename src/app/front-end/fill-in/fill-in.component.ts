import { Survey } from '../../@interface/SurveyList';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../@service/quest-service';
import { Question } from '../../@interface/Question';
import { DialogService } from '../../@service/dialog.service';
import { LoadingService } from '../../@service/loading-service';
import { HttpClientService } from '../../http-service/http-client.service';

@Component({
  selector: 'app-fill-in',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  templateUrl: './fill-in.component.html',
  styleUrl: './fill-in.component.scss',
})
export class FillInComponent {
  // 問卷基本資訊
  quizId!: number;
  name!: string;
  description!: string;
  startDate!: string;
  endDate!: string;
  survey: any = {};

  // 問題相關
  questionArray: Question[] = [];
  newQuestionArray: Array<any> = [];

  // 使用者資訊
  userName!: string;
  userPhone!: string;
  userEmail!: string;
  userAge!: string;

  constructor(
    private router: Router,
    private questService: QuestService,
    private loading: LoadingService,
    private dialogService: DialogService,
    private http: HttpClientService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.quizId = this.questService.questData.quizId;

    // 從預覽頁回來
    if (this.questService.questData.userName) {
      this.loadFromPreview(this.questService.questData);
      this.userName = this.questService.questData.userName;
      this.userPhone = this.questService.questData.userPhone;
      this.userEmail = this.questService.questData.userEmail;
      this.userAge = this.questService.questData.userAge;
    }
    // 從首頁進來，載入後端資料
    else if (this.questService.questData) {
      this.loadFromBackend(this.quizId);
    } else {
      this.dialogService.showAlert('⚠️ 問卷載入失敗，請稍後重試');
    }

    this.cdr.detectChanges();
  }

  // 從後端載入問卷資料
  loadFromBackend(quizId: number): void {
    const req = { id: this.quizId };
    this.loading.show();
    this.http
      .postApi('http://localhost:8080/admin/search_quiz', req)
      .subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            console.log(res);
            const survey = {
              quizId: res.id,
              name: res.name,
              description: res.description,
              startDate: res.startDate,
              endDate: res.endDate,
              questionArray: res.question_list.map((q: any) => ({
                questionId: q.question_id,
                title: q.title,
                type: q.type,
                necessary: q.necessary,
                options: (q.option_list = JSON.parse(q.option_list)),
              })),
            };
            this.survey = survey;
            this.questService.questData = survey; // 緩存資料
            this.refreshFormData();
            //this.setupPreviewFields();
          }
          this.loading.hide();
        },
        error: (err) => {
          console.error('問卷載入錯誤:', err);
          this.dialogService.showAlert('⚠️ 問卷載入失敗，請稍後重試');
          this.loading.hide();
        },
      });
  }

  // 刷新表單資料
  refreshFormData(): void {
    const surveyData = this.survey;
    if (surveyData) {
      this.name = surveyData.name;
      this.description = surveyData.description;
      this.startDate = surveyData.startDate;
      this.endDate = surveyData.endDate;
      this.questionArray = surveyData.questionArray;
    }
  }

  // 從預覽頁載入問卷資料
  loadFromPreview(surveyData: any): void {
    if (!surveyData || typeof surveyData !== 'object') {
      this.dialogService.showAlert('⚠️ loadFromPreview() 傳遞錯誤');
      return;
    }
    this.survey.userName = surveyData.userName || '';
    this.survey.userPhone = surveyData.userPhone || '';
    this.survey.userEmail = surveyData.userEmail || '';
    this.survey.userAge = surveyData.userAge || '';
    this.survey.quizId = surveyData.quizId;
    this.survey.name = surveyData.name;
    this.survey.description = surveyData.description;
    this.survey.startDate = surveyData.startDate;
    this.survey.endDate = surveyData.endDate;
    this.survey.questionArray = surveyData.questionArray || [];
  }

  checkNecessary(): boolean {
    const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRge = /^09[0-9]{8}$/;
    // 若要剛好是 10 位數，要加開頭（^）和結尾（$）限制，不然輸入 11 位數也給過

    // 1. 基本資料
    if (!(this.userName && this.userEmail)) {
      this.dialogService.showAlert('✍️ 名稱與信箱為必填項');
      return false;
    }

    if (!emailReg.test(this.userEmail)) {
      this.dialogService.showAlert('⚠️ 信箱格式不正確');
      return false;
    }

    if (this.userPhone && !phoneRge.test(this.userPhone)) {
      this.dialogService.showAlert('⚠️ 手機格式不正確');
      return false;
    }

    // 2. 問題選項 (用迴圈遍歷每個問題)
    for (let question of this.survey.questionArray) {
      // 3. 如果是必填
      if (question.necessary) {
        // 3-1. 簡答 (answer)
        if (question.type === 'T' && !question.answer) {
          this.dialogService.showAlert('✍️ 請確認簡答題必填皆有填寫');
          return false;
        }
        // 3-2. 單選 (radioAnswer)
        if (question.type === 'S' && !question.radioAnswer) {
          this.dialogService.showAlert('✍️ 請確認單選題必填皆有填寫');
          return false;
        }
        // 3-3. 多選 (checkbox)
        if (question.type === 'M') {
          console.log('多選題資料:', question.options);
          let check = false; // 先預設多選框皆未填
          for (let opt of question.options) {
            if (opt.boxBoolean) {
              check = true;
            }
          }
          if (!check) {
            this.dialogService.showAlert('✍️ 請確認多選題必填皆有填寫');
            return false;
          }
        }
      }
    }
    return true;
  }

  // 提交到預覽頁
  submitToPreview(): void {
    this.setupPreviewFields();
    if (this.checkNecessary()) {
      this.questService.questData = {
        quizId: this.quizId,
        userName: this.userName,
        userPhone: this.userPhone,
        userEmail: this.userEmail,
        userAge: this.userAge,
        name: this.name,
        startDate: this.startDate,
        endDate: this.endDate,
        description: this.description,
        questionArray: this.survey.questionArray,
      };
      console.log('提交到預覽頁', this.questService.questData);
      this.router.navigate(['/preview', this.quizId]);
    }
  }
  // 為了讓預覽畫面有資料，必須新增兩個"欄位"放它們：文字輸入(answer)、單選(radioAnswer)
  // 在問題的選擇中加入 boxBoolean 讓 checkbox(多選) 去進行資料綁定
  setupPreviewFields() {
    // 1. 新增 answer 和 radioAnswer
    this.survey.questionArray.map((question: any) => ({
      ...question,
      answer:'',
      radioAnswer: '',
      // 2. 新增一個空陣列接收包含新屬性的 boxBoolean 的資料
      options: question.options.map((option: any) => ({
        ...option,
        boxBoolean: option.boxBoolean !== undefined ? option.boxBoolean : false,
      })),
    }));
    console.log('設定回答結果', this.survey.questionArray);
  }
}
