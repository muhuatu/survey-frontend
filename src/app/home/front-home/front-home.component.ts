import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SurveyList } from '../../@interface/SurveyList';
import { DateService } from '../../@service/date-service';
import { QuestService } from '../../@service/quest-service';
import { UserService } from '../../@service/user-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientService } from '../../http-service/http-client.service';

@Component({
  selector: 'app-front-home',
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
  templateUrl: './front-home.component.html',
  styleUrl: './front-home.component.scss',
})
export class FrontHomeComponent {
  constructor(
    private router: Router,
    private dateService: DateService,
    private userService: UserService,
    private questService: QuestService,
    private http: HttpClientService
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
  displayedColumns: string[] = ['name', 'status', 'startDate', 'endDate'];

  // 分頁查詢
  dataSource = new MatTableDataSource<SurveyList>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // 預設日期
    this.defaultDate = this.dateService.changeDateFormat();
    this.isAdmin = this.userService.isAdmin;

    if (!this.isAdmin) {
      this.dataSource.data = ELEMENT_DATA.filter(
        (item) =>
          item.statusCode !== 'NOT_PUBLISHED' &&
          item.statusCode !== 'NOT_STARTED'
      );
    }

    // 前台顯示的表格內容
    this.displayedColumns = ['name', 'status', 'startDate', 'endDate'];
  }

  // 判斷值變更(生命週期)
  ngDoCheck(): void {
    //this.isAdmin = this.userService.isAdmin;
  }

  // 搜尋
  search() {
    const req = {
      name: this.searchReq.name,
      start_date: this.searchReq.startDate,
      end_date: this.searchReq.endDate,
    };

    this.http
      .postApi('http://localhost:8080/user/search', req)
      .subscribe((res: any) => {
        console.log('搜尋結果:', res);
      }),
      (error: any) => {
        console.error('搜尋錯誤:', error);
      };
  }

  // 路徑：編輯或填寫問卷（後端接資料）
  toFillIn(element: any) {
    if (element.statusCode === 'IN_PROGRESS') {
      this.router.navigate(['/fill-in']);
    }
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
}

const ELEMENT_DATA: any[] = [
  {
    name: '《三體》書籍讀者問卷調查',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-05',
    endDate: '2024-12-01',
  },
  {
    name: '你最常吃的速食餐點？',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-06',
    endDate: '2024-12-02',
  },
  {
    name: '你對異國料理的喜好如何？',
    statusCode: 'NOT_STARTED',
    status: '已結束',
    startDate: '2024-11-08',
    endDate: '2024-12-03',
  },
  {
    name: '你最喜歡的甜點是什麼？',
    statusCode: 'END',
    status: '已結束',
    startDate: '2024-11-15',
    endDate: '2024-12-04',
  },
  {
    name: '有什麼飲品讓你感覺幸福？',
    statusCode: 'NOT_PUBLISHED',
    status: '尚未發布',
    startDate: '2024-11-05',
    endDate: '2024-12-05',
  },
  {
    name: '你是否喜歡吃辣的食物？',
    statusCode: 'END',
    status: '已結束',
    startDate: '2024-11-07',
    endDate: '2024-12-06',
  },
  {
    name: '你最推薦的早餐是什麼？',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-11',
    endDate: '2024-12-07',
  },
  {
    name: '你吃宵夜的頻率如何？',
    statusCode: 'END',
    status: '已結束',
    startDate: '2024-11-01',
    endDate: '2024-12-08',
  },
  {
    name: '你覺得健康飲食重要嗎？',
    statusCode: 'NOT_STARTED',
    status: '尚未開始',
    startDate: '2024-11-02',
    endDate: '2024-12-09',
  },
  {
    name: '你平常最常吃什麼水果？',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-20',
    endDate: '2024-12-10',
  },
  {
    name: '你平時下廚的頻率如何？',
    statusCode: 'NOT_STARTED',
    status: '尚未開始',
    startDate: '2024-11-19',
    endDate: '2024-12-11',
  },
  {
    name: '你最想嘗試的新食材是什麼？',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-05',
    endDate: '2024-12-12',
  },
  {
    name: '你對蔬菜的接受程度如何？',
    statusCode: 'NOT_STARTED',
    status: '尚未開始',
    startDate: '2024-11-11',
    endDate: '2024-12-13',
  },
];
