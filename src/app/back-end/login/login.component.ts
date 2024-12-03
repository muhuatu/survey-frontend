import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../@service/user-service';
import { HttpClientService } from '../../http-service/http-client.service';
import { QuestService } from '../../@service/quest-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private questService: QuestService,
    private http: HttpClientService
  ) {}

  // 登入功能
  login() {
    this.userService.isAdmin = true;
    this.router.navigate(['/home']);
  }
}
