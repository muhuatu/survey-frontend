import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../../@service/quest-service';
import { UserService } from '../../../@service/user-service';
import { HttpClientService } from '../../../http-service/http-client.service';
import { LoadingService } from '../../../@service/loading-service';
import { Option } from '../../../@interface/Question';
import { DialogService } from '../../../@service/dialog.service';

@Component({
  selector: 'app-check',
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
  templateUrl: './check.component.html',
  styleUrl: './check.component.scss',
})
export class CheckComponent {
  constructor(
    private router: Router,
    private questService: QuestService,
    private userService: UserService,
    private http: HttpClientService,
    private loading: LoadingService,
    private dialogService: DialogService
  ) {}

  // 宣告變數
  transferData!: any;
  userName!: string;
  userPhone!: string;
  userEmail!: string;
  userAge!: string;

  ngOnInit(): void {
    this.transferData = this.questService.questData;
  }

  toQuestionSettings(quizId: number) {
    const q = { ...this.transferData, isPreview: true };
    this.questService.questData = q;
    this.router.navigate(['/question-settings', quizId], { state: { q, quizId } });
  }

  // 發布問卷
  toPublish() {
    // 將 this.transferData 存進資料庫
    let frontendReq = {
      id: this.transferData?.quizId || 0,
      name: this.transferData?.name,
      description: this.transferData?.description,
      start_date: this.transferData?.startDate,
      end_date: this.transferData?.endDate,
      published: true,
      question_list: this.transferData?.questionArray.map((q: any) => ({
        question_id: q.questionId,
        title: q.title,
        type: q.type,
        necessary: q.necessary,
        option_list: JSON.stringify(
          q.options.map((item: Option) => ({
            option: item.option,
            optionNumber: String(item.optionNumber), // 確保是字串
          }))
        ),
      })),
    };

    this.loading.show();

    // 判斷 id 為 0 就是新增
    if (this.transferData?.quizId === 0) {
      this.http
        .postApi('http://localhost:8080/admin/create', frontendReq)
        .subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              const transferQuizId = this.transferData.quizId;
              this.questService.questData = null; // 發布後資料需清除
              this.questService.questData = { quizId: transferQuizId }; // 更新結構
              this.dialogService.showAlert('問卷已發布。');
              this.userService.isAdmin = true;
              this.router.navigate(['/home']);
              //this.router.navigate(['/publish', transferQuizId]);
            } else {
              console.error('發布失敗');
            }
          },
          error: (err) => {
            console.log(err.message);
          },
          complete: () => {
            this.loading.hide();
          },
        });
    } else {
      this.http
        .postApi('http://localhost:8080/admin/update', frontendReq)
        .subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              const transferQuizId = this.transferData.quizId;
              this.questService.questData = null; // 發布後資料需清除
              this.questService.questData = { quizId: transferQuizId }; // 更新結構
              this.dialogService.showAlert('問卷已發布。');
              this.userService.isAdmin = true;
              this.router.navigate(['/home']);
              //this.router.navigate(['/publish', transferQuizId]);
            } else {
              console.error('發布失敗');
            }
          },
          error: (err) => {
            console.log(err.message);
          },
          complete: () => {
            this.loading.hide();
          },
        });
    }
  }

  // 儲存問卷：published 會是 false
  toSave() {
    // 將 this.questData 存進資料庫
    let frontendReq = {
      id: this.transferData?.quizId || 0,
      name: this.transferData?.name,
      description: this.transferData?.description,
      start_date: this.transferData?.startDate,
      end_date: this.transferData?.endDate,
      published: false,
      question_list: this.transferData?.questionArray.map((q: any) => ({
        question_id: q.questionId,
        title: q.title,
        type: q.type,
        necessary: q.necessary,
        option_list: JSON.stringify(
          q.options.map((item: Option) => ({
            option: item.option,
            optionNumber: String(item.optionNumber), // 確保是字串
          }))
        ),
      })),
    };

    //console.log(frontendReq);
    //console.log(this.transferData?.quizId);

    this.loading.show();

    // 判斷 id 為 0 就是新增
    if (this.transferData?.quizId === 0) {
      this.http
        .postApi('http://localhost:8080/admin/create', frontendReq)
        .subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              //const transferQuizId = this.transferData.quizId;
              this.questService.questData = null; // 發布後資料需清除
              //this.questService.questData = { quizId: transferQuizId }; // 更新結構
              this.dialogService.showAlert('問卷已儲存。');
              this.userService.isAdmin = true;
              this.router.navigate(['/home']);
            } else {
              console.error('發布失敗');
            }
          },
          error: (err) => {
            console.log(err.message);
          },
          complete: () => {
            this.loading.hide();
          },
        });
    } else {
      this.http
        .postApi('http://localhost:8080/admin/update', frontendReq)
        .subscribe({
          next: (res: any) => {
            console.log('frontendReq', frontendReq);
            if (res.code === 200) {
              //const transferQuizId = this.transferData.quizId;
              this.questService.questData = null; // 發布後資料需清除
              //this.questService.questData = { quizId: transferQuizId }; // 更新結構
              this.dialogService.showAlert('問卷已儲存。');
              this.userService.isAdmin = true;
              this.router.navigate(['/home']);
            } else {
              console.error('發布失敗');
            }
          },
          error: (err) => {
            console.log(err.message);
          },
          complete: () => {
            this.loading.hide();
          },
        });
    }

  }
}
