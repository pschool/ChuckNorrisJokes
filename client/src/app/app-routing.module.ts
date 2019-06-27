import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from './auth/guards/logged-in/logged-in.guard';
import { LoginComponent } from './auth/components/login/login.component';
import { LoggedOutGuard } from './auth/guards/logged-out/logged-out.guard';
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { MainDisplayComponent } from './display/components/main-display/main-display.component';

const routes: Routes = [
  { path: '', component: MainDisplayComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoggedOutGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedOutGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
