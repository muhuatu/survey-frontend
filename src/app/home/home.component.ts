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
import { MatIcon } from '@angular/material/icon';

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
    private questService: QuestService
  ) {}

  surveyName = '';
  startDate = '';
  endDate = '';
  defaultDate = ''; // 預設日期(今日)
  isAdmin!: boolean;

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

    if (!this.isAdmin) {
      this.dataSource.data = ELEMENT_DATA.filter(
        (item) => item.statusCode !== 'NOT_PUBLISHED'
      );
    }

    // 動態呈現
    this.displayedColumns = this.isAdmin
      ? ['checkbox', 'id', 'name', 'status', 'startDate', 'endDate','url']
      : ['id', 'name', 'status', 'startDate', 'endDate'];
  }

  // 判斷值變更(生命週期)
  ngDoCheck(): void {
    this.isAdmin = this.userService.isAdmin;
    //console.log('Home ngDoCheck : 管理者(true)、使用者(false)：' + this.isAdmin);
  }

  // 搜尋(後端寫)
  search() {}

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
    this.questService.questData = null;
    this.router.navigate(['/question-settings']);
  }

  // 路徑：統計圖
  toChart(element: any) {
    if (element.statusCode == 'END' || element.statusCode == 'IN_PROGRESS') {
      this.router.navigate(['/response-list']);
    }
  }

  // 路徑：填寫頁面
  toFillIn(element: any) {
    if (element.statusCode == 'IN_PROGRESS') {
      this.router.navigate(['/fill-in']);
    }
  }

  // 路徑：編輯問卷（後端接資料）
  toEditOrFillIn(element: any) {
    if (element.statusCode == 'NOT_PUBLISHED') {
      this.router.navigate(['/question-settings']);
    } else if (element.statusCode == 'IN_PROGRESS') {
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
}

const ELEMENT_DATA: SurveyList[] = [
  {
    checkbox: false,
    id: 1,
    name: '《三體》書籍讀者問卷調查',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-05',
    endDate: '2024-12-01',
    url: '1',
  },
  {
    checkbox: false,
    id: 11,
    name: '你最常吃的速食餐點？',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-06',
    endDate: '2024-12-02',
    url: '2',
  },
  {
    checkbox: false,
    id: 7,
    name: '你對異國料理的喜好如何？',
    statusCode: 'END',
    status: '已結束',
    startDate: '2024-11-08',
    endDate: '2024-12-03',
    url: '3',
  },
  {
    checkbox: false,
    id: 5,
    name: '你最喜歡的甜點是什麼？',
    statusCode: 'END',
    status: '已結束',
    startDate: '2024-11-15',
    endDate: '2024-12-04',
    url: '4',
  },
  {
    checkbox: false,
    id: 4,
    name: '有什麼飲品讓你感覺幸福？',
    statusCode: 'NOT_PUBLISHED',
    status: '尚未發布',
    startDate: '2024-11-05',
    endDate: '2024-12-05',
    url: '5',
  },
  {
    checkbox: false,
    id: 6,
    name: '你是否喜歡吃辣的食物？',
    statusCode: 'END',
    status: '已結束',
    startDate: '2024-11-07',
    endDate: '2024-12-06',
    url: '6',
  },
  {
    checkbox: false,
    id: 3,
    name: '你最推薦的早餐是什麼？',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-11',
    endDate: '2024-12-07',
    url: '7',
  },
  {
    checkbox: false,
    id: 8,
    name: '你吃宵夜的頻率如何？',
    statusCode: 'END',
    status: '已結束',
    startDate: '2024-11-01',
    endDate: '2024-12-08',
    url: '8',
  },
  {
    checkbox: false,
    id: 9,
    name: '你覺得健康飲食重要嗎？',
    statusCode: 'NOT_STARTED',
    status: '尚未開始',
    startDate: '2024-11-02',
    endDate: '2024-12-09',
    url: '9',
  },
  {
    checkbox: false,
    id: 10,
    name: '你平常最常吃什麼水果？',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-20',
    endDate: '2024-12-10',
    url: '10',
  },
  {
    checkbox: false,
    id: 2,
    name: '你平時下廚的頻率如何？',
    statusCode: 'NOT_STARTED',
    status: '尚未開始',
    startDate: '2024-11-19',
    endDate: '2024-12-11',
    url: '11',
  },
  {
    checkbox: false,
    id: 12,
    name: '你最想嘗試的新食材是什麼？',
    statusCode: 'IN_PROGRESS',
    status: '進行中',
    startDate: '2024-11-05',
    endDate: '2024-12-12',
    url: '12',
  },
  {
    checkbox: false,
    id: 13,
    name: '你對蔬菜的接受程度如何？',
    statusCode: 'NOT_STARTED',
    status: '尚未開始',
    startDate: '2024-11-11',
    endDate: '2024-12-13',
    url: '13',
  },
];
