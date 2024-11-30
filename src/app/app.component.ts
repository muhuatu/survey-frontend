import { LoadingService } from './@service/loading-service';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from './@service/user-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { SidenavTestComponent } from './sidenav-test/sidenav-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatProgressSpinnerModule,
    CommonModule,
    SidenavTestComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private userService: UserService
  ) {}

  isAdmin!: boolean;
  loading$!: any;
  animal!: string;
  name!: string;

  // 在頁面渲染前執行以下程式碼
  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin;
    this.loading$ = this.loadingService.loading$;
  }

  // 判斷值變更(生命週期)
  ngDoCheck(): void {
    this.isAdmin = this.userService.isAdmin;
    //console.log('App ngOnInit : 管理者(true)、使用者(false)：' + this.isAdmin);
  }

  toHome() {
    this.router.navigate(['/front-home']);
  }

  toLogin() {
    this.router.navigate(['/login']);
  }

  // 將 Dialog 注入 MatDialog
  // readonly dialog = inject(MatDialog);

  // showDialog() {
  //   const dialogRef = this.dialog.open(DialogComponent, {
  //     data: { name: 'name', animal: 'title' },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(result);
  //   });
  // }


}
