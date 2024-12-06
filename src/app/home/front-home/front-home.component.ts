import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { StatusCode, Survey, SurveyList } from '../../@interface/SurveyList';
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
import { LoadingService } from '../../@service/loading-service';
import { DialogService } from '../../@service/dialog.service';

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
    private http: HttpClientService,
    private loading: LoadingService,
    private dialogService: DialogService
  ) {}

  name = '';
  startDate = '';
  endDate = '';
  defaultDate = ''; // 預設日期(今日)
  isAdmin!: boolean;
  statusCode!: string; // 用在 HTML 搜尋
  allData: SurveyList[] = []; // 用來儲存所有資料的容器

  survey: Survey = {
    published: false, // 預設尚未發布
    startDate: '',
    endDate: '',
  };

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
    this.isAdmin = false;
    this.loadAllData();

    // 前台顯示的表格內容
    this.displayedColumns = ['name', 'status', 'startDate', 'endDate', 'url'];
  }

  // 判斷值變更(生命週期)
  ngDoCheck(): void {
    this.isAdmin = this.userService.isAdmin;
  }

  toStatistics(element: any) {
    this.questService.questData = { quizId: 0 };
      this.questService.questData.quizId = element.id;
    this.router.navigate(['/statistics-list', element.id]);
  }


  // 路徑：填寫問卷
  toFillIn(element: SurveyList) {
    // 確認問卷狀態是否為 IN_PROGRESS
    if (element.status === StatusCode.IN_PROGRESS) {
      // 導航到 fill-in 組件，並傳遞問卷 ID
      this.questService.questData = { quizId: 0 };
      this.questService.questData.quizId = element.id;
      this.router.navigate(['/fill-in', element.id]);
    } else {
      // 顯示提示訊息
      this.dialogService.showAlert('僅進行中的問卷可以填寫');
    }
  }

  // 清空搜尋
  searchClear() {
    this.searchReq.name = '';
    this.searchReq.startDate = '';
    this.searchReq.endDate = '';
    this.loadAllData();
  }

  // 搜尋
  search() {
    const req = {
      name: this.searchReq.name,
      start_date: this.searchReq.startDate,
      end_date: this.searchReq.endDate,
    };

    this.loading.show();

    this.http
      .postApi('http://localhost:8080/search', req)
      .subscribe((res: any) => {
        console.log('後端搜尋結果:', res);
        this.allData = res.quizList.map((item: any) => ({
          checkbox: false,
          id: item.id,
          name: item.name,
          status: this.getSurveyStatus({
            ...item, // 傳遞完整物件
            startDate: item.start_date || '',
            endDate: item.end_date || '',
          }),
          statusCode: this.getSurveyStatus({
            ...item, // 傳遞完整物件
            startDate: item.start_date || '',
            endDate: item.end_date || '',
          }),
          startDate: item.start_date,
          endDate: item.end_date,
          url: item.url,
        }));
        // 篩選資料
        if (!this.isAdmin) {
          this.dataSource.data = this.allData.filter((item) => {
            return (
              item.status !== StatusCode.NOT_PUBLISHED &&
              item.status !== StatusCode.NOT_STARTED
            );
          });
        } else {
          this.dataSource.data = [...this.allData];
        }
        this.loading.hide();
      }),
      (error: any) => {
        console.error('搜尋錯誤:', error);
      };
  }

  // 搜尋所有資料(預設)
  loadAllData() {
    this.loading.show();

    this.http.postApi('http://localhost:8080/search', {}).subscribe({
      next: (res: any) => {
        console.log('所有資料:', res);
        this.allData = res.quizList.map((item: any) => ({
          checkbox: false,
          id: item.id,
          name: item.name,
          status: this.getSurveyStatus({
            ...item, // 傳遞完整物件
            startDate: item.start_date || '',
            endDate: item.end_date || '',
          }),
          statusCode: this.getSurveyStatus({
            ...item, // 傳遞完整物件
            startDate: item.start_date || '',
            endDate: item.end_date || '',
          }),
          startDate: item.start_date,
          endDate: item.end_date,
          //url: item.url,
        }));

        // 篩選資料
        if (!this.isAdmin) {
          this.dataSource.data = this.allData.filter((item) => {
            return (
              item.status !== StatusCode.NOT_PUBLISHED &&
              item.status !== StatusCode.NOT_STARTED
            );
          });
        } else {
          this.dataSource.data = [...this.allData];
        }
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
  // changeData(event: Event) {
  //   let tidyData: SurveyList[] = [];
  //   ELEMENT_DATA.forEach((res) => {
  //     if (res.name.indexOf((event.target as HTMLInputElement).value) != -1) {
  //       tidyData.push(res);
  //     }
  //   });
  //   this.dataSource.data = tidyData;
  // }
}

const ELEMENT_DATA: SurveyList[] = [];
