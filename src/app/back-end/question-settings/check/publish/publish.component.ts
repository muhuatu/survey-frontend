import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './publish.component.html',
  styleUrl: './publish.component.scss'
})
export class PublishComponent {

  constructor(private router: Router) {}

  ban(){
    alert('問卷已發布，無法進入此連結')
    return;
  }

}
