import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { DateService } from '../../@service/date-service';
import { DialogService } from '../../@service/dialog.service';
import { LoadingService } from '../../@service/loading-service';
import { QuestService } from '../../@service/quest-service';
import { HttpClientService } from '../../http-service/http-client.service';

@Component({
  selector: 'app-feedback',
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
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  constructor(
    private router: Router,
    private questService: QuestService,
    private loading: LoadingService,
    private dialogService: DialogService,
    private http: HttpClientService,
    private dateService: DateService,
    private cdr: ChangeDetectorRef
  ) {}

  replyData!: any;
  quizId!: number;
  responseId!: number;
  survey: any = {};
  defaultDate = ''; // 預設日期(今日)

  ngOnInit(): void {
    this.defaultDate = this.dateService.changeDateFormat();
    this.quizId = this.questService.questData.quizId;
    this.responseId = this.questService.questData.responseId;
    // 在資料加載後再處理
    this.loadFromBackend(this.quizId, this.responseId);
  }

  getMultiIndex(options: any[], opt: any): number {
    return options.filter((opt) => opt.boxBoolean === true).indexOf(opt);
  }

  formatAnswer(answer: string): string {
    const parsedAnswer = JSON.parse(answer);
    return parsedAnswer.length === 1 && parsedAnswer[0] === ''
      ? '無填寫'
      : parsedAnswer.join('\n');
  }

  formatAgeOrPhone(param: number): string {
    if (param === null || undefined) {
      return '無填寫';
    }
    const newParam = param.toString();
    return param === 0 ? '無填寫' : newParam;
  }

  // 從後端傳入指定 quizId & responseId 的資料
  loadFromBackend(quizId: number, responseId: number): void {
    this.loading.show();

    this.http
      .getApi(
        `http://localhost:8080/admin/get_response_by_id?quizId=${quizId}&responseId=${responseId}`
      )
      .subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            const reply = {
              name: res.responseDTOList[0].quizName,
              description: res.responseDTOList[0].description,
              fillInDate: res.responseDTOList[0].fillInDate,
              userName: res.responseDTOList[0].username,
              userEmail: res.responseDTOList[0].email,
              userPhone: this.formatAgeOrPhone(res.responseDTOList[0].phone),
              userAge: this.formatAgeOrPhone(res.responseDTOList[0].age),
              questionArray: res.responseDTOList.map((r: any) => ({
                title: r.title,
                answer: r.answerStr,
              })),
            };
            this.replyData = reply;
            console.log(this.replyData);

            this.cdr.detectChanges(); // 觸發變更檢測
          }
          this.loading.hide();
        },
        error: (err) => {
          console.error('問卷回覆載入錯誤:', err);
          this.dialogService.showAlert('⚠️ 問卷載入失敗，請稍後重試');
          this.loading.hide();
        },
      });
  }
}
