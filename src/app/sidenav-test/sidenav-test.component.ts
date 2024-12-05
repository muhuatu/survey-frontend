import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { LoadingService } from '../@service/loading-service';
import { UserService } from '../@service/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav-test',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIcon,
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidenav-test.component.html',
  styleUrl: './sidenav-test.component.scss',
})
export class SidenavTestComponent {
  constructor(private router: Router, private userService: UserService) {}

  @ViewChild(MatSidenav) sidenav!: MatSidenav;  // 取得 MatSidenav 參考

  isAdmin!: boolean;
  loading$!: any;
  animal!: string;
  name!: string;
  url = window.location.href;

  // 頁面一打開就執行
  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin;
  }

  // 判斷值變更(生命週期)
  ngDoCheck(): void {
    this.isAdmin = this.userService.isAdmin;
  }

  toHome() {
    if (this.isAdmin) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/front-home']);
    }
    this.closeSidenav();  // 導航後關閉 sidenav
  }

  login() {
    if (this.isAdmin) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
    this.closeSidenav();  // 導航後關閉 sidenav
  }

  logOut() {
    this.userService.isAdmin = false;
    //window.location.reload(); // 重新整理，不然就要把首頁分成兩個組件
    this.router.navigate(['/front-home']);
  }

  checkUrl() {
    // 如果畫面是login的話，就會返回'hideSiden'的CSS(隱藏)
    if (window.location.href.indexOf('login') != -1) return 'hideSiden';
    return null;
  }

  closeSidenav() {
    if (this.sidenav) {
      this.sidenav.close();  // 關閉 sidenav
    }
  }
}
