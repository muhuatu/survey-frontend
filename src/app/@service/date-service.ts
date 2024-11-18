import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  // 宣告變數
  defaultDate = '';
  today = new Date();
  year = this.today.getFullYear();
  // 由於獲取到的月份是從0開始，所以需加一
  month = ('0' + (this.today.getMonth() + 1)).slice(-2); // slice(-2)拷貝陣列中的最後兩個元素
  day = ('0' + this.today.getDate()).slice(-2);
  hour = this.today.getHours();
  min = this.today.getMinutes();

  // 抽取年月日
  changeDateFormat() {
    return (this.defaultDate = this.year + '-' + this.month + '-' + this.day);
  }

  // 抽取年月日時間
  changeTimeFormat(date: Date) {
    return (this.defaultDate =
      this.year +
      '-' +
      this.month +
      '-' +
      this.day +
      ' ' +
      this.hour +
      ':' +
      this.min);
  }

  startDate = '';
  endDate = '';

  // 判斷"結束日期"不可小於"開始日期"
  checkEndDate(startDate: string): void {
    // 1. 賦值給開始日期
    this.startDate = startDate;

    // 2. 判斷
    if (this.endDate < this.startDate) {
      this.endDate = this.startDate; // 如果END小於START就讓它們相等囉!!
    }
  }
}
