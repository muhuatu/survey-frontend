import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../../@service/quest-service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent {
  constructor(private router: Router, private questService: QuestService) {}

  questData!: any;

  ngOnInit(): void {
    this.questData = this.questService.questData;
  }

  toFillIn() {
    this.router.navigate(['/fill-in']);
  }

  toSubmit() {
    // 儲存後必須將Service的資料清空，避免錯誤
    this.questService.questData = '';
    alert('問卷已填寫完畢，點擊確定後將跳轉至首頁');
    this.router.navigate(['/home']);
  }

  getMultiIndex(options: any[], opt: any): number {
    return options.filter((opt) => opt.boxBoolean === true).indexOf(opt);
  }
}
