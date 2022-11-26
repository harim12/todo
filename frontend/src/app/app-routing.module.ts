import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { BodyComponent } from './body/body.component';
import { HomeComponent } from './home/home.component';
import { ImportantTodosComponent } from './important-todos/important-todos.component';
import { LoginComponent } from './login/login.component';

import { NextTodosComponent } from './next-todos/next-todos.component';
import { ProductivityComponent } from './productivity/productivity.component';
import { RegisterComponent } from './register/register.component';

import { TodosComponent } from './todos/todos.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TodosComponent },
      { path: 'today', component: TodosComponent },
      { path: 'todos', component: TodosComponent },
      { path: 'important', component: ImportantTodosComponent },
      { path: 'next', component: NextTodosComponent },
      { path: 'productivity', component: ProductivityComponent },
    ],
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
