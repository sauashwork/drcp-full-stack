import { Routes } from '@angular/router';
import { Disasters } from './components/disasters/disasters';
import { Resources } from './components/resources/resources';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { Home } from './components/home/home';
import { Updates } from './components/updates/updates';
import { Reports } from './components/reports/reports';
import { Login } from './components/forms/login/login';
import { Signup } from './components/forms/signup/signup';
import { ForgetPassword } from './components/forms/forget-password/forget-password';
import { AppLayout } from './components/app-layout/app-layout';
import { AuthGuard } from './services/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'forget-password', component: ForgetPassword },
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: Home },
      { path: 'disasters', component: Disasters },
      { path: 'resources', component: Resources },
      { path: 'reports', component: Reports },
      { path: 'updates', component: Updates }
    ]
  },
  { path: '**', component: PageNotFound }
];