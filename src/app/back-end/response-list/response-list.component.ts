import { Response } from '../../@interface/Question';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientService } from '../../http-service/http-client.service';
import { LoadingService } from '../../@service/loading-service';
import { StatusCode, SurveyList } from '../../@interface/SurveyList';
import { QuestService } from '../../@service/quest-service';
import { DialogService } from '../../@service/dialog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-response-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterModule,
    MatTableModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './response-list.component.html',
  styleUrl: './response-list.component.scss',
})
export class ResponseListComponent {
  constructor(
    private router: Router,
    private questService: QuestService,
    private http: HttpClientService,
    private loading: LoadingService,
    private dialogService: DialogService
  ) {}

  dataSource = new MatTableDataSource<Response>(ELEMENT_DATA);
  displayedColumns: string[] = [
    'responseId',
    'responseUserName',
    'responseDate',
    'responseUrl',
  ];
  quizId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // 獲取前頁面的問卷ID
    this.quizId = this.questService.questData.quizId;
    this.loadFromBackend(this.quizId);
  }

  toStatistics() {
    this.questService.questData.quizId = this.quizId;
    this.router.navigate(['/statistics-list', this.quizId]);
  }

  // 前往個人回覆頁 (綁在 HTML 中的 responseUrl)
  toFeedback(element: any) {
      this.questService.questData = { quizId: this.quizId };
      this.questService.questData.responseId = element.responseId;
      this.router.navigate(['/feedback', element.responseId]);
  }

  // 從後端載入問卷資料
  loadFromBackend(quizId: number): void {
    this.loading.show();

    this.http
      .getApi(
        `http://localhost:8080/admin/get_all_response_by_id?quizId=${quizId}`
      )
      .subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            const responseMap = new Map();
            res.responseDTOList.forEach((item: any) => {
              if (!responseMap.has(item.responseId)) {
                responseMap.set(item.responseId, {
                  responseId: item.responseId,
                  responseUserName: item.username,
                  responseDate: item.fillInDate,
                });
              }
            });

            // 將 Map 轉換為陣列
            const survey = Array.from(responseMap.values());
            //console.log(survey);
            this.dataSource = new MatTableDataSource(survey);
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

  // 資料排序
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // function (a, b) 可簡化為 (a, b) =>
    this.dataSource.data = this.dataSource.data.sort(function (a, b) {
      if (a.replyID > b.replyID) {
        return -1;
      }
      if (a.replyID < b.replyID) {
        return 1;
      }
      return 0;
    });
  }

  // 給模糊搜尋用的
  name = '';
  // 模糊搜尋
  changeData(event: Event) {
    let tidyData: Response[] = [];
    ELEMENT_DATA.forEach((res) => {
      if (
        res.replyName.indexOf((event.target as HTMLInputElement).value) != -1
      ) {
        tidyData.push(res);
      }
    });
    this.dataSource.data = tidyData;
  }
}

const ELEMENT_DATA: Response[] = [];
