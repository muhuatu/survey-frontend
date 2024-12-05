import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../@service/user-service';
import { HttpClientService } from '../../http-service/http-client.service';
import { QuestService } from '../../@service/quest-service';
import { DialogService } from '../../@service/dialog.service';
import { LoadingService } from '../../@service/loading-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private questService: QuestService,
    private http: HttpClientService,
    private loading: LoadingService,
    private dialogService: DialogService
  ) {}

  email!: string;
  password!: string;
  errorMessage: string = '';
  isPasswordVisibility: boolean = false;

  isPasswordVisibilityToggle() {
    this.isPasswordVisibility = !this.isPasswordVisibility;
  }

  // 登入功能
  login() {
    const req = {
      email: this.email,
      password: this.password,
    };

    if (!req.email || !req.password) {
      this.dialogService.showAlert('請輸入管理員信箱與密碼');
      return;
    }

    this.loading.show();

    this.http.postApi('http://localhost:8080/admin/login', req).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          console.log(res);
          this.dialogService.showAlert('登錄成功');
          this.userService.isAdmin = true;
          this.router.navigate(['/home']);
        } else {
          this.dialogService.showAlert('帳號或密碼錯誤');
          this.loading.hide();
        }
        this.loading.hide();
      },
      error: (err) => {
        const errorMessage = err.error?.message || '伺服器發生未知錯誤';
        this.dialogService.showAlert(errorMessage);
        this.loading.hide();
      },
    });
  }
}
