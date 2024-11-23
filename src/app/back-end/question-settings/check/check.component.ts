import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../../@service/quest-service';
import { UserService } from '../../../@service/user-service';

@Component({
  selector: 'app-check',
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
  templateUrl: './check.component.html',
  styleUrl: './check.component.scss',
})
export class CheckComponent {
  constructor(
    private router: Router,
    private questService: QuestService,
    private userService: UserService,
  ) {}

  // 宣告變數
  questData!: any;
  userName!: string;
  userPhone!: string;
  userEmail!: string;
  userAge!: string;
  isNew = true;

  ngOnInit(): void {
    this.questData = this.questService.questData;
    if (
      this.questService.questStatus === 'NOT_PUBLISHED' ||
      this.questService.questStatus === 'NOT_STARTED'
    ) {
      this.isNew = false;
    }
  }

  toQuestionSettings() {
    this.router.navigate(['/question-settings']);
  }

  toPublish() {
    this.questService.questData = null; // 發布後資料需清除
    this.router.navigate(['/publish']);
  }

  toSave() {
    alert('問卷已儲存，將跳轉至首頁。');
    this.questService.questStatus = 'NOT_PUBLISHED';
    this.userService.isAdmin = true;
    this.router.navigate(['/home']);
  }
}
