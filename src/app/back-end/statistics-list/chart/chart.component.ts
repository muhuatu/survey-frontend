import { Component, ElementRef, Input, input, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  @Input() dataId!: string;
  @Input() questData!: any;

  constructor() {}

  ngOnInit(): void {}

  // 因為需要抓取頁面標籤所以需要使用ngAfterViewInit這個生命週期
  // 這個生命週期為當頁面渲染結束後才會觸發
  ngAfterViewInit(): void {
    this.createPie();
  }

  // 獲取 canvas 元素
  // 這段的程式碼表示去抓HTML中ID是chart的label，data就是圖表裡面的資料設定。
  // 使用 題目ID 當 canvas的ID 來分類，重複ID會報錯。(ID必為PK)
  createPie() {
    // 獲取 canvas 元素
    // 使用題目ID當作canvas的ID來分類
    // 否則ID重複程式會失敗
    let ctx = document.getElementById(this.dataId) as HTMLCanvasElement;

    // 建立資料
    let data = {
      labels: this.questData.labels,
      datasets: [
        {
          label: '統計',
          data: this.questData.data,
          fill: false,
          backgroundColor: [
            'rgba(66, 133, 244, 0.5)',
            'rgba(219, 68, 55, 0.5)',
            'rgba(244, 160, 0, 0.5)',
            'rgba(15, 157, 88, 0.5)',
            'rgba(171, 71, 188, 0.5)',
            'rgba(255, 112, 67, 0.5)',
            'rgba(0, 172, 193, 0.5)',
          ],
          borderColor: [
            'rgb(66, 133, 244)',
            'rgb(219, 68, 55)',
            'rgb(244, 160, 0)',
            'rgb(15, 157, 88)',
            'rgb(171, 71, 188)',
            'rgb(255, 112, 67)',
            'rgb(0, 172, 193)',
          ],

          borderWidth: 1,
        },
      ],
    };

    // 圖表選項
    var options = {
      scales: {
        y: {
          // y 軸從 0 開始
          beginAtZero: true,
        },
      },
    };

    // 創建圖表
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }
}
