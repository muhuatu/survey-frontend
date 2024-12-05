import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { LoadingService } from '../../@service/loading-service';
import { QuestService } from '../../@service/quest-service';
import { HttpClientService } from '../../http-service/http-client.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../@service/dialog.service';

@Component({
  selector: 'app-statistics-list',
  standalone: true,
  imports: [ChartComponent, RouterModule],
  templateUrl: './statistics-list.component.html',
  styleUrl: './statistics-list.component.scss',
})
export class StatisticsListComponent {
  constructor(
    private router: Router,
    private questService: QuestService,
    private http: HttpClientService,
    private loading: LoadingService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  quizId!: number;
  questData!: any;

  ngOnInit(): void {
    // 獲取前頁面的問卷ID
    this.quizId = this.questService.questData.quizId;
    this.loadFromBackend(this.quizId);
  }

  toResponse() {
    this.questService.questData = { quizId: this.quizId };
    this.questService.questData.quizId = this.quizId;
    this.router.navigate(['/response-list', this.quizId]);
  }

  // 從後端傳入指定 quizId 的資料
  loadFromBackend(quizId: number): void {
    this.loading.show();

    this.http
      .getApi(`http://localhost:8080/admin/get_statistics?quizId=${quizId}`)
      .subscribe({
        next: (res: any) => {
          if (
            res.code === 200 &&
            res.statisticsVoList &&
            res.statisticsVoList.length > 0
          ) {
            this.questData = {
              questName: res.statisticsVoList[0].quizName,
              quest: res.statisticsVoList.map((item: any) => ({
                id: item.questionId.toString(),
                name: item.title,
                labels: Object.keys(item.optionCountMap),
                data: Object.values(item.optionCountMap),
              })),
            };
            //console.log('questData:', this.questData);
            this.cdr.detectChanges();
          } else if (res.code !== 200) {
            this.dialogService.showAlert('⚠️ 此問卷尚無數據');
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

  // questData1 = {
  //   questName: '《進擊的巨人》調查問卷結果',
  //   quest: [
  //     {
  //       id: '1',
  //       type: 'M',
  //       name: '您最喜歡的《進擊的巨人》角色是誰？',
  //       labels: ['艾連', '三笠', '阿爾敏', '里維', '艾爾文', '韓吉', '萊納'],
  //       data: [250, 300, 200, 150, 300, 75, 50],
  //     },
  //     {
  //       id: '2',
  //       type: 'M',
  //       name: '《進擊的巨人》中哪個情節最引發您的思考？',
  //       labels: [
  //         '巨人之謎',
  //         '人類與巨人的戰爭',
  //         '瑪利亞之牆的失守',
  //         '尤彌爾的故事',
  //         '調查兵團的冒險',
  //         '內幕陰謀',
  //         '自由與命運',
  //       ],
  //       data: [200, 350, 150, 300, 250, 175, 100],
  //     },
  //     {
  //       id: '3',
  //       type: 'T',
  //       name: '請分享您對《進擊的巨人》中主要理念的看法或感受。',
  //       labels: [],
  //       data: [
  //         '自由的重要性',
  //         '人類的奮鬥精神',
  //         '戰爭與和平',
  //         '英雄主義',
  //         '犧牲與成長',
  //       ],
  //     },
  //   ],
  // };
}
