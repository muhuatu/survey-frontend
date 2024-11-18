import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';


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
  ],
  templateUrl: './sidenav-test.component.html',
  styleUrl: './sidenav-test.component.scss',
})
export class SidenavTestComponent {

}
