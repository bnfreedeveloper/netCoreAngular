import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthguardGuard } from './services/authguard.guard';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "employee", component: EmployeeComponent, canActivate: [AuthguardGuard] },
  { path: "logout", component: LogoutComponent },
  { path: "", component: LoginComponent, pathMatch: "full" },
  { path: "**", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
