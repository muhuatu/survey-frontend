import { Response } from '../../@interface/Question';
import { Component, ViewChild } from '@angular/core';
import { DateService } from '../../@service/date-service';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-response-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterModule,
    MatTableModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatPaginatorModule,
  ],
  templateUrl: './response-list.component.html',
  styleUrl: './response-list.component.scss',
})
export class ResponseListComponent {
  constructor(private router: Router, private dateService: DateService) {}

  dataSource = new MatTableDataSource<Response>(ELEMENT_DATA);
  displayedColumns: string[] = ['replyID', 'replyName', 'date', 'url'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // 資料排序
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // function (a, b) 可簡化為 (a, b) =>
    this.dataSource.data = this.dataSource.data.sort(function (a, b) {
      if (a.replyID > b.replyID) {
        return -1;
      }
      if (a.replyID < b.replyID) {
        return 1;
      }
      return 0;
    });
  }

  ban() {
    alert('問卷已發布，無法進入此連結');
    return;
  }

  // 給模糊搜尋用的
  name = '';

  // 模糊搜尋
  changeData(event: Event) {
    let tidyData: Response[] = [];
    ELEMENT_DATA.forEach((res) => {
      if (res.replyName.indexOf((event.target as HTMLInputElement).value) != -1) {
        tidyData.push(res);
      }
    });
    this.dataSource.data = tidyData;
  }
}

const ELEMENT_DATA: Response[] = [
  {
    replyID: 1,
    replyName: 'ちいかわ',
    date: '2024/11/16 20:11',
    url: '/preview',
  },
  {
    replyID: 2,
    replyName: 'ハチワレ',
    date: '2024/11/16 20:11',
    url: '/preview',
  },
  {
    replyID: 3,
    replyName: 'うさぎ',
    date: '2024/11/16 20:11',
    url: '/preview',
  },
  {
    replyID: 4,
    replyName: 'モモンガ',
    date: '2024/11/16 20:11',
    url: '/preview',
  },
  {
    replyID: 5,
    replyName: 'くりまんじゅう',
    date: '2024/11/16 20:11',
    url: '/preview',
  },
  {
    replyID: 6,
    replyName: '鎧さん',
    date: '2024/11/16 20:11',
    url: '/preview',
  },
  {
    replyID: 7,
    replyName: 'シーサー',
    date: '2024/11/16 20:11',
    url: '/preview',
  },
  {
    replyID: 8,
    replyName: 'あの子',
    date: '2024/11/16 20:11',
    url: '/preview',
  },
];
