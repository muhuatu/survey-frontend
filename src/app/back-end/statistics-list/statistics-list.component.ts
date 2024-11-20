import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-statistics-list',
  standalone: true,
  imports: [ChartComponent, RouterModule],
  templateUrl: './statistics-list.component.html',
  styleUrl: './statistics-list.component.scss',
})
export class StatisticsListComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  questData = {
    questName: '《進擊的巨人》調查問卷結果',
    sDate: '2024/11/06',
    eDate: '2024/12/23',
    quest: [
      {
        id: '1',
        type: 'M',
        name: '您最喜歡的《進擊的巨人》角色是誰？',
        labels: ['艾連', '三笠', '阿爾敏', '里維', '艾爾文', '韓吉', '萊納'],
        data: [250, 300, 200, 150, 700, 75, 50],
      },
      {
        id: '2',
        type: 'M',
        name: '《進擊的巨人》中哪個情節最引發您的思考？',
        labels: [
          '巨人之謎',
          '人類與巨人的戰爭',
          '瑪利亞之牆的失守',
          '尤彌爾的故事',
          '調查兵團的冒險',
          '內幕陰謀',
          '自由與命運',
        ],
        data: [200, 350, 150, 300, 250, 175, 100],
      },
      {
        id: '3',
        type: 'T',
        name: '請分享您對《進擊的巨人》中主要理念的看法或感受。',
        labels: [],
        data: [
          '自由的重要性',
          '人類的奮鬥精神',
          '戰爭與和平',
          '英雄主義',
          '犧牲與成長',
        ],
      },
    ],
  };

}
