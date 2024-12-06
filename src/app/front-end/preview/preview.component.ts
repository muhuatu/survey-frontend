import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../@service/quest-service';
import { DialogService } from '../../@service/dialog.service';
import { LoadingService } from '../../@service/loading-service';
import { HttpClientService } from '../../http-service/http-client.service';
import { DateService } from '../../@service/date-service';

@Component({
  selector: 'app-preview',
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
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent {
  constructor(
    private router: Router,
    private questService: QuestService,
    private loading: LoadingService,
    private dialogService: DialogService,
    private http: HttpClientService,
    private dateService: DateService
  ) {}

  isAdmin!: boolean;
  questData!: any;
  quizId!: number;
  survey: any = {};
  defaultDate = ''; // 預設日期(今日)

  ngOnInit(): void {
    this.isAdmin = this.questService.questData.isAdmin;
    this.defaultDate = this.dateService.changeDateFormat();
    this.quizId = this.questService.questData.quizId;
    this.questData = this.questService.questData;
    //console.log('PreviewComponent: ', this.questData);
  }

  toFillIn() {
    this.quizId = this.questService.questData.quizId;
    this.questData = this.questService.questData;
    this.router.navigate(['/fill-in', this.quizId]);
  }

  getAnswers(survey: any) {
    // survey 是 this.questData (this.questService.questData)

    let answers: { [key: number]: Array<string | null> } = {};

    for (const question of survey.questionArray) {
      let answerStr: Array<string | null> = [];

      // 單選題
      if (question.type === 'S') {
        question.options.forEach((opt: any) => {
          if (question.radioAnswer == opt.optionNumber) {
            answerStr.push(opt.option);
          }
        });
      }
      // 多選題
      if (question.type === 'M') {
        question.options.forEach((opt: any) => {
          if (opt.boxBoolean) {
            answerStr.push(opt.option);
          }
        });
      }
      // 簡答題
      if (question.type === 'T' && question.answer) {
        answerStr.push(question.answer);
      }
      if (answerStr.length === 0) {
        answerStr.push("");
      }

      answers[question.questionId] = answerStr;
    }
    return answers;
  }

  getAns() {
    let answer: { [key: number]: Array<string> } = {};

    for (let i = 0; i < this.questData.questionArray.length; i++) {
      let answerStr: Array<string> = [];
      if (this.questData.questionArray[i].type == 'S') {
        this.questData.questionArray[i].options.forEach((item: any) => {
          if (
            this.questData.questionArray[i].radioAnswer == item.optionNumber
          ) {
            answerStr.push(item.option);
          }
        });
      }
      if (this.questData.questionArray[i].type == 'M') {
        this.questData.questionArray[i].options.forEach((item: any) => {
          if (item.boxBoolean) {
            answerStr.push(item.option);
          }
        });
      }
      if (this.questData.questionArray[i].type == 'T') {
        answerStr.push(this.questData.questionArray[i].answer);
      }
      answer[this.questData.questionArray[i].questionId] = answerStr;
    }
  }

  // 儲存回覆到資料庫(API)
  toSubmit(quizId: number) {
    //let answers: { [key: number]: Array<string | null> } = {};
    let answers = this.getAnswers(this.questData);

    const req = {
      quiz_id: this.quizId,
      username: this.questData.userName,
      email: this.questData.userEmail,
      phone: this.questData.userPhone,
      age: this.questData.userAge,
      answers: answers,
      fill_in_date: this.defaultDate,
    };

    console.log('提交的問卷資料:', req);

    this.loading.show();
    this.http.postApi('http://localhost:8080/fillIn', req).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.code === 200) {
          this.questService.questData = ''; // 清空資料
          this.dialogService.showAlert(
            '問卷已填寫完畢，點擊確定後將跳轉至首頁'
          );
          this.router.navigate(['/front-home']);
        }
      },
      error: (err) => {
        console.error('問卷載入錯誤:', err.message);
        this.dialogService.showAlert('⚠️ 問卷載入失敗，請稍後重試');
      },
      complete: () => {
        this.loading.hide(); // 確保隱藏 loading
      },
    });
  }

  getMultiIndex(options: any[], opt: any): number {
    return options.filter((opt) => opt.boxBoolean === true).indexOf(opt);
  }
}
