import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionSettingsComponent } from './back-end/question-settings/question-settings.component';
import { PublishComponent } from './back-end/question-settings/check/publish/publish.component';
import { ResponseListComponent } from './back-end/response-list/response-list.component';
import { CheckComponent } from './back-end/question-settings/check/check.component';
import { FillInComponent } from './front-end/fill-in/fill-in.component';
import { PreviewComponent } from './front-end/fill-in/preview/preview.component';
import { ChartComponent } from './back-end/statistics-list/chart/chart.component';
import { StatisticsListComponent } from './back-end/statistics-list/statistics-list.component';
import { LoginComponent } from './back-end/login/login.component';
import { SidenavTestComponent } from './sidenav-test/sidenav-test.component';
import { FrontHomeComponent } from './home/front-home/front-home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/front-home', pathMatch: 'full' },
  {
    path: 'sidenav-test',
    component: SidenavTestComponent,
  },
  {
    path: 'front-home',
    component: FrontHomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'question-settings/:id',
    component: QuestionSettingsComponent,
  },
  {
    path: 'check',
    component: CheckComponent,
  },
  {
    path: 'publish',
    component: PublishComponent,
  },
  {
    path: 'chart',
    component: ChartComponent,
  },
  {
    path: 'response-list',
    component: ResponseListComponent,
  },
  {
    path: 'fill-in',
    component: FillInComponent,
  },
  {
    path: 'preview',
    component: PreviewComponent,
  },
  {
    path: 'statistics-list',
    component: StatisticsListComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
