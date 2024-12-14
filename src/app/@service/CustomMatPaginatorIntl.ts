import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = '每頁顯示筆數：'; // 自訂文字
  override nextPageLabel = '下一頁'; // 下一頁按鈕文字
  override previousPageLabel = '上一頁'; // 上一頁按鈕文字

  // 如果需要更多動態化控制，也可以覆寫這個方法
  // override getRangeLabel = (page: number, pageSize: number, length: number): string => {
  //   if (length === 0 || pageSize === 0) {
  //     return `第 0 筆共 ${length} 筆`;
  //   }
  //   const startIndex = page * pageSize;
  //   const endIndex = Math.min(startIndex + pageSize, length);
  //   return `第 ${startIndex + 1} - ${endIndex} 筆，共 ${length} 筆`;
  // };
}
