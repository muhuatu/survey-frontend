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

  constructor(private router: Router, private questService: QuestService) {}

  // 宣告變數
  questData!: any;
  userName!: string;
  userPhone!: string;
  userEmail!: string;
  userAge!: string;

  ngOnInit(): void {
    this.questData = this.questService.questData;
  }

  toQuestionSettings() {
    this.router.navigate(['/question-settings']);
  }

  toPublish() {
    this.questService.questData = null; // 發布後資料需清除
    this.router.navigate(['/publish']);
  }

  toSave(){
    this.questService.questStatus = 'NOT_PUBLISHED';
    this.router.navigate(['/home']);
  }

}
