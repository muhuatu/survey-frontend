import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SurveyList } from '../@interface/SurveyList';
import { Router } from '@angular/router';
import { DateService } from '../@service/date-service';
import { UserService } from '../@service/user-service';
import { MatIconModule } from '@angular/material/icon';
import { QuestService } from '../@service/quest-service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientService } from '../http-service/http-client.service';
import { StatusCode } from '../@interface/SurveyList';
import { Survey } from '../@interface/SurveyList';
import { LoadingService } from '../@service/loading-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private dateService: DateService,
    private userService: UserService,
    private questService: QuestService,
    private http: HttpClientService,
    private loading: LoadingService
  ) {}

  name = '';
  startDate = '';
  endDate = '';
  defaultDate = ''; // 預設日期(今日)
  isAdmin!: boolean;
  element = { statusCode: 'IN_PROGRESS' }; // 初始值可以根據需求調整

  searchReq = {
    name: '',
    startDate: '',
    endDate: '',
  };

  // 表格呈現的欄位
  displayedColumns: string[] = [
    'checkbox',
    'id',
    'name',
    'status',
    'startDate',
    'endDate',
    'url',
  ];

  // 分頁查詢
  dataSource = new MatTableDataSource<SurveyList>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // 預設日期
    this.defaultDate = this.dateService.changeDateFormat();
    this.isAdmin = this.userService.isAdmin;
    this.loadAllData();

    // 後台顯示的內容
    this.displayedColumns = [
      'checkbox',
      'id',
      'name',
      'status',
      'startDate',
      'endDate',
      'url',
    ];
  }

  // 判斷值變更(生命週期)
  ngDoCheck(): void {
    this.isAdmin = this.userService.isAdmin;
  }

  // 刪除複數問題
  deleteQuestions() {
    if (confirm('確定要刪除嗎？')) {
      this.dataSource.data = this.dataSource.data.filter(
        (question) => !question.checkbox
      );
    }
  }

  // 新增問卷路徑：用在 + 的 icon 上
  toQuestionSetting() {
    // 設置 questData 為 null，並初始化 quizId 為 0
    this.questService.questData = { quizId: 0 };
    let quizId = this.questService.questData.quizId;
    this.router.navigate(['/question-settings', quizId]);
  }

  // 路徑：統計圖
  toChart(element: any) {
    if (element.statusCode === 'END' || element.statusCode === 'IN_PROGRESS') {
      this.router.navigate(['/response-list']);
    }
  }

  // 路徑：編輯或填寫問卷（後端接資料）
  toEditOrFillIn(element: any) {
    if (
      element.statusCode === 'NOT_PUBLISHED' ||
      element.statusCode === 'NOT_STARTED'
    ) {
      this.router.navigate(['/question-settings', element.quizId]);
    } else if (element.statusCode === 'IN_PROGRESS') {
      this.router.navigate(['/fill-in']);
    }
  }

  // 判斷"結束日期"不可小於"開始日期"
  checkEndDate(startDate: string): void {
    // 1. 賦值給開始日期
    this.startDate = startDate;
    // 2. 如果END小於START就讓它們相等囉!!
    if (this.endDate < this.startDate) {
      this.endDate = this.startDate;
    }
  }

  // 資料排序
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // function (a, b) 可簡化為 (a, b) =>
    this.dataSource.data = this.dataSource.data.sort(function (a, b) {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
  }

  // 模糊搜尋
  changeData(event: Event) {
    let tidyData: SurveyList[] = [];
    ELEMENT_DATA.forEach((res) => {
      if (res.name.indexOf((event.target as HTMLInputElement).value) != -1) {
        tidyData.push(res);
      }
    });
    this.dataSource.data = tidyData;
  }

  // 搜尋
  search() {
    const req = {
      name: this.searchReq.name,
      start_date: this.searchReq.startDate,
      end_date: this.searchReq.endDate,
    };

    this.http
      .postApi('http://localhost:8080/admin/search', req)
      .subscribe((res: any) => {
        console.log('後端搜尋結果:', res);

        const result: SurveyList[] = res.quizList.map((item: any) => ({
          checkbox: false,
          id: item.id,
          name: item.name,
          status: this.getSurveyStatus(item), // 其實不太懂為何用item當參數就好?!
          startDate: item.start_date,
          endDate: item.end_date,
          url: item.url,
        }));
        this.dataSource.data = result;
        console.log(result);
      }),
      (error: any) => {
        console.error('搜尋錯誤:', error);
      };
  }

  allData: SurveyList[] = []; // 用來儲存所有資料的容器

  // 搜尋所有資料(預設)
  loadAllData() {
    this.loading.show();

    this.http.postApi('http://localhost:8080/admin/search', {}).subscribe({
      next: (res: any) => {
        //console.log('所有資料:', res);
        this.allData = res.quizList.map((item: any) => ({
          checkbox: false,
          id: item.id,
          name: item.name,
          status: this.getSurveyStatus(item),
          startDate: item.start_date,
          endDate: item.end_date,
          url: item.url,
        }));
        this.dataSource.data = [...this.allData]; // 把資料都加進來!!
      },
      error: (error: any) => {
        console.error('加載資料錯誤:', error);
      },
      complete: () => {
        this.loading.hide();
      },
    });
  }

  getSurveyStatus(survey: Survey): string {
    const today = new Date().toISOString().split('T')[0];

    // 如果問卷尚未發布，直接返回 "尚未發布"
    if (!survey.published) {
      return StatusCode.NOT_PUBLISHED;
    }

    // 如果已經過了結束日期，則狀態為 "已結束"
    if (survey.endDate < today) {
      return StatusCode.END;
    }

    // 如果今天的日期在開始日期之後，且還沒有結束，則狀態為 "進行中"
    if (survey.startDate <= today && survey.endDate >= today) {
      return StatusCode.IN_PROGRESS;
    }

    // 如果以上條件都不成立，則狀態為 "尚未開始"
    return StatusCode.NOT_STARTED;
  }
}

const ELEMENT_DATA: SurveyList[] = [];
