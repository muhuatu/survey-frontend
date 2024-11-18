import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-statistics-list',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './statistics-list.component.html',
  styleUrl: './statistics-list.component.scss',
})
export class StatisticsListComponent {
  questData = {
    questName: '範例問卷標題',
    sDate: '2024/11/06',
    eDate: '2024/12/23',
    quest: [
      {
        id: '1',
        type: 'M',
        name: '你最愛的台灣小吃是什麼？',
        labels: ['雞排', '滷肉飯', '臭豆腐', '牛肉麵', '蚵仔煎'],
        data: [500, 300, 150, 400, 200],
      },
      {
        id: '2',
        type: 'Q',
        name: '你最愛的飲料是什麼？',
        labels: ['珍珠奶茶', '檸檬愛玉', '仙草蜜', '冬瓜茶', '西瓜汁'],
        data: [600, 450, 200, 300, 150],
      },
      {
        id: '3',
        type: 'T',
        name: '對這些美食的評語',
        labels: [],
        data: ['很好吃', '有點甜', '非常推薦', '不錯', '份量剛好'],
      },
    ]

  };
  constructor(private router: Router) {}

  ngOnInit(): void {}

  toHome() {
    this.router.navigate(['/home']);
  }
}
