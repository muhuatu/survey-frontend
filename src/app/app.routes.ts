import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionSettingsComponent } from './back-end/question-settings/question-settings.component';
import { ResponseListComponent } from './back-end/response-list/response-list.component';
import { CheckComponent } from './back-end/question-settings/check/check.component';
import { FillInComponent } from './front-end/fill-in/fill-in.component';
import { PreviewComponent } from './front-end/preview/preview.component';
import { ChartComponent } from './back-end/statistics-list/chart/chart.component';
import { StatisticsListComponent } from './back-end/statistics-list/statistics-list.component';
import { LoginComponent } from './back-end/login/login.component';
import { SidenavTestComponent } from './sidenav-test/sidenav-test.component';
import { FrontHomeComponent } from './home/front-home/front-home.component';
import { FeedbackComponent } from './front-end/feedback/feedback.component';

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
    path: 'check/:id',
    component: CheckComponent,
  },
  {
    path: 'chart/:id',
    component: ChartComponent,
  },
  {
    path: 'response-list/:id',
    component: ResponseListComponent,
  },
  {
    path: 'fill-in/:id',
    component: FillInComponent,
  },
  {
    path: 'preview/:id',
    component: PreviewComponent,
  },
  {
    path: 'feedback/:id',
    component: FeedbackComponent,
  },
  {
    path: 'statistics-list/:id',
    component: StatisticsListComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
