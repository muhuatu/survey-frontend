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
    questName: '《三體》書籍讀者問卷調查結果',
    sDate: '2024/11/06',
    eDate: '2024/12/23',
    quest: [
      {
        id: '1',
        type: 'M',
        name: '您最喜歡《三體》中的哪個角色？',
        labels: ['汪淼', '葉文潔', '羅輯', '史強', '章北海', '丁儀', '魏成'],
        data: [250, 300, 200, 150, 100, 75, 50],
      },
      {
        id: '2',
        type: 'M',
        name: '《三體》中哪個情節最引發您的思考？',
        labels: [
          '三體問題的解釋',
          '黑暗森林理論',
          '降維打擊',
          '文明間的聯繫與對抗',
          '面壁計劃',
          '宇宙社會學',
          '自我犧牲',
        ],
        data: [200, 350, 150, 300, 250, 175, 100],
      },
      {
        id: '3',
        type: 'T',
        name: '請分享您對《三體》中科學理論的理解或見解。',
        labels: [],
        data: [
          '黑暗森林理論非常有趣',
          '降維打擊的概念很新奇',
          '書中對於文明衝突的描寫很深刻',
          '三體問題的解釋讓人耳目一新',
          '面壁計劃的策略性很強',
        ],
      },
    ],
  };
}
