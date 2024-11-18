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

    // 設定數據
    let data = {
      // x 軸文字
      labels: this.questData.labels,
      datasets: [
        {
          // 數據
          data: this.questData.data,
          // 線與邊框顏色
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          // borderColor: [
          //   'rgb(255, 99, 132)',
          //   'rgb(255, 159, 64)',
          //   'rgb(255, 205, 86)',
          //   'rgb(75, 192, 192)',
          //   'rgb(54, 162, 235)',
          //   'rgb(153, 102, 255)',
          //   'rgb(201, 203, 207)',
          // ],
          //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
          hoverOffset: 4,
        },
      ],
    };

    if (ctx) {
      // 創建圖表
      let chart = new Chart(ctx, {
        //pie 是圓餅圖, doughnut 是環狀圖, bar 是長條圖
        type: 'pie',
        data: data,
      });
    }
  }
}
