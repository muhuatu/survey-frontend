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
    private loading: LoadingService
  ) {}

  // 宣告變數
  questData!: any;
  userName!: string;
  userPhone!: string;
  userEmail!: string;
  userAge!: string;
  isNew = true;

  ngOnInit(): void {
    this.questData = this.questService.questData;
    if (
      this.questService.questStatus === 'NOT_PUBLISHED' ||
      this.questService.questStatus === 'NOT_STARTED'
    ) {
      this.isNew = false;
    }

  }

  toQuestionSettings() {
    this.router.navigate(['/question-settings']);
  }

  //
  toPublish() {
    // 將 this.questData 存進資料庫
    let frontendReq = {
      id: this.questData?.quizId || 0,
      name: this.questData?.name,
      description: this.questData?.description,
      start_date: this.questData?.startDate,
      end_date: this.questData?.endDate,
      published: true,
      question_list: this.questData?.questionArray.map(
        (q: any) => ({
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
        })
      ),
    };

    this.loading.show();

    // 判斷 id 為 0 就是新增
    this.http
      .postApi('http://localhost:8080/admin/create&update', frontendReq)
      .subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            this.questService.questData = null; // 發布後資料需清除
            //this.loading.hide();
            this.router.navigate(['/publish']);
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

  // published 會是 false
  toSave() {
    alert('問卷已儲存，將跳轉至首頁。');
    this.questService.questStatus = 'NOT_PUBLISHED';
    this.userService.isAdmin = true;
    this.router.navigate(['/home']);
  }
}
