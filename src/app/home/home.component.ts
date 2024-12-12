import { Survey } from './../@interface/SurveyList';
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
import { LoadingService } from '../@service/loading-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogService } from '../@service/dialog.service';

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
    private loading: LoadingService,
    private dialogService: DialogService
  ) {}

  quizId!: number;
  name = '';
  startDate = '';
  endDate = '';
  defaultDate = ''; // 預設日期(今日)
  isAdmin!: boolean;
  statusCode!: string; // 用在 HTML 搜尋
  allData: SurveyList[] = []; // 用來儲存所有資料的容器

  survey: Survey = {
    published: null,
    startDate: '',
    endDate: '',
  };

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

  // 刪除問卷
  deleteQuizs() {
    // 找出所有勾選的問卷ID
    const selectedQuizIds = this.dataSource.data
      .filter((quiz) => quiz.checkbox) // 篩選出已選中的問卷
      .map((quiz) => quiz.id); // 取得問卷的ID

    if (selectedQuizIds.length === 0) {
      this.dialogService.showAlert('請至少選擇一個問卷進行刪除');
      return;
    }

    const selectedStatus = this.dataSource.data
      .filter((quiz) => quiz.checkbox) // 篩選出已選中的問卷
      .map((quiz) => quiz.status);

    if (selectedStatus[0] === StatusCode.IN_PROGRESS) {
      this.dialogService.showAlert('進行中的問卷不可刪除');
      return;
    }

    this.dialogService.showDialogWithCallback(
      'Confirm',
      '您確定要刪除此問卷嗎？',
      () => {
        // 後台聯動資料庫刪除 quizId_list
        const req = { quizId_list: selectedQuizIds };

        // 用API獲取問卷資料
        this.loading.show();

        this.http.postApi('http://localhost:8080/admin/delete', req).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              // 獲取要刪除的問卷資料
              this.questService.questData = {
                id: res.id,
                name: res.name,
                description: res.description,
                startDate: res.start_date,
                endDate: res.end_date,
                published: res.published,
                questionArray: res.question_list,
              };
            }
            // 前台渲染，將已刪除的問卷從顯示資料中移除
            this.dataSource.data = this.dataSource.data.filter(
              (question) => !selectedQuizIds.includes(question.id)
            );
            // 隱藏 loading
            this.loading.hide();
          },
          error: (err) => {
            // 錯誤處理
            console.error('刪除問卷時發生錯誤:', err);
            this.loading.hide();
          },
        });
      }
    );
  }

  // 新增問卷路徑：用在 + 的 icon 上
  toQuestionSetting() {
    // 設置 questData 為 null，並讓 quizId 為 0
    this.questService.questData = { quizId: 0 };
    let quizId = this.questService.questData.quizId;
    this.router.navigate(['/question-settings', quizId]);
  }

  // 路徑：回覆頁面
  toResponse(element: SurveyList) {
    if (
      element.status === StatusCode.IN_PROGRESS ||
      element.status === StatusCode.END
    ) {
      this.questService.questData = { quizId: 0 };
      this.questService.questData.quizId = element.id;
      this.router.navigate(['/response-list', element.id]);
    }
  }

  // 路徑：填寫問卷
  toFillIn(element: SurveyList) {
    // 確認問卷狀態是否為 IN_PROGRESS
    if (element.status === StatusCode.IN_PROGRESS) {
      // 導航到 fill-in 組件，並傳遞問卷 ID
      this.questService.questData = { quizId: 0 };
      this.questService.questData.quizId = element.id;
      this.router.navigate(['/fill-in', element.id]);
    }
  }

  // 路徑：編輯問卷
  toEdit(survey: Survey): void {
    // 找出勾選的問卷
    const selectedQuiz = this.dataSource.data.filter((quiz) => quiz.checkbox);

    // 驗證是否有選中問卷
    if (selectedQuiz.length === 0) {
      this.dialogService.showAlert('請選擇問卷進行編輯');
      return;
    }
    if (selectedQuiz.length > 1) {
      this.dialogService.showAlert('只能選擇一筆問卷進行編輯');
      return;
    }

    const editQuiz = selectedQuiz[0]; // 獲取選中的問卷
    const status = editQuiz.status;

    // 初始化 questData
    if (!this.questService.questData) {
      this.questService.questData = {}; // 防止 questData 為 undefined
    }

    // 只允許未發布或未開始的問卷進行編輯
    if (
      status === StatusCode.NOT_PUBLISHED ||
      status === StatusCode.NOT_STARTED
    ) {
      this.questService.questData.quizId = editQuiz.id;
      this.router.navigate(['/question-settings', editQuiz.id], {
        state: { data: survey },
      });
    } else {
      this.dialogService.showAlert('此問卷無法編輯');
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
      .postApi('http://localhost:8080/admin/search', req)
      .subscribe((res: any) => {
        //console.log('後端搜尋結果:', res);
        const result: SurveyList[] = res.quizList.map((item: any) => ({
          checkbox: false,
          id: item.id,
          name: item.name,
          status: this.getSurveyStatus({
            ...item,
            startDate: item.start_date || '',
            endDate: item.end_date || '',
          }),
          statusCode: this.getSurveyStatus({
            ...item,
            startDate: item.start_date || '',
            endDate: item.end_date || '',
          }),
          startDate: item.start_date,
          endDate: item.end_date,
          url: item.url,
        }));
        this.dataSource.data = result; // 表格渲染
        this.loading.hide();
      }),
      (error: any) => {
        console.error('搜尋錯誤:', error);
      };
  }

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
          status: this.getSurveyStatus({
            ...item, // 傳遞完整物件
            startDate: item.start_date || '', // 預設為空字串避免 undefined
            endDate: item.end_date || '',
          }),
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
