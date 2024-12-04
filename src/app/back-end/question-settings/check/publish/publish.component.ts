import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DialogService } from '../../../../@service/dialog.service';
import { QuestService } from '../../../../@service/quest-service';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './publish.component.html',
  styleUrl: './publish.component.scss',
})
export class PublishComponent {
  quizId!: number;
  link!: string;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private questService: QuestService
  ) {}

  ngOnInit(): void {
    this.quizId = this.questService.questData.quizId;
  }

  ban() {
    this.dialogService.showAlert('問卷已發布，無法進入此連結');
    return;
  }
}
