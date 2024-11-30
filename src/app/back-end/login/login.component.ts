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

    // this.http
    //   .postApi('http://localhost:8080/login', {
    //     username: '1234',
    //     password: 'aaaaaaaa',
    //   })
    //   .subscribe((res: any) => {
    //     console.log('Response:', res.code);
    //     if (res.code == 200) {
    //       this.questService.questData = res.data;
    //       console.log(this.questService.questData);
    //       if (this.userService.isAdmin) {
    //         this.router.navigate(['/home']);
    //       } else {
    //         this.router.navigate(['/front-home']);
    //       }
    //     }
    //   });
  }
}
