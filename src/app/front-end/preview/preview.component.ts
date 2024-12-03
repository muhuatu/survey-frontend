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

  questData!: any;
  quizId!: number;
  survey: any = {};

  ngOnInit(): void {
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

    let answers: { [key: number]: Array<string> } = {};

    for (const question of survey.questionArray) {
      let answerStr: Array<string> = [];
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
      } else if (question.type === 'T') {
        answerStr.push('');
      }
      answers[question.questionId] = answerStr;
    }
    return answers;
  }

  // 儲存回覆到資料庫(API)
  toSubmit(quizId: number) {
    let answers: { [key: number]: Array<string> } = {};
    answers = this.getAnswers(this.questData);

    const req = {
      quiz_id: this.quizId,
      username: this.questData.userName,
      phone: this.questData.userPhone,
      email: this.questData.userEmail,
      age: this.questData.userAge,
      answers: answers,
      fill_in_date: new Date(),
    };

    console.log('提交的問卷資料:', req);

    this.loading.show();
    this.http.postApi('http://localhost:8080/fillIn', req).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          console.log(res);
          this.loading.hide();
          this.questService.questData = ''; // 清空資料
          this.dialogService.showAlert(
            '問卷已填寫完畢，點擊確定後將跳轉至首頁'
          );
          this.router.navigate(['/home']);
          //this.refreshFormData();
        }
      },
      error: (err) => {
        console.error('問卷載入錯誤:', err);
        this.dialogService.showAlert('⚠️ 問卷載入失敗，請稍後重試');
        this.loading.hide();
      },
    });
  }

  getMultiIndex(options: any[], opt: any): number {
    return options.filter((opt) => opt.boxBoolean === true).indexOf(opt);
  }
}
