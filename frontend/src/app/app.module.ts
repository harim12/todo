import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TodosComponent } from './todos/todos.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ImportantTodosComponent } from './important-todos/important-todos.component';
import { NextTodosComponent } from './next-todos/next-todos.component';
import { ProductivityComponent } from './productivity/productivity.component';
import { MonthProductivityComponent } from './month-productivity/month-productivity.component';
import { WeekProductivityComponent } from './week-productivity/week-productivity.component';
import { HttpClientModule , HTTP_INTERCEPTORS  } from '@angular/common/http';
import { LoginComponent } from './login/login.component';

import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/auth.guard';
import { TokenInterceptorService } from './shared/token-interceptor.service';
import { Token } from '@angular/compiler';

import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    SidenavComponent,
    TodosComponent,
    TodoDialogComponent,
    ImportantTodosComponent,
    NextTodosComponent,
    ProductivityComponent,
    MonthProductivityComponent,
    WeekProductivityComponent,
    LoginComponent,

    RegisterComponent,
    HomeComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgbPaginationModule,
    NgbAlertModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgbModule,
   

  ],
  providers: [AuthGuard,
  { 
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  }                       
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
