import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  apiUrlGetUsers = 'http://localhost:1337/users/get/all';
  apiUrlLogin = 'http://localhost:1337/users/login';
  apiUrlRegister = 'http://localhost:1337/users/register';
  apiUrlValidate = 'http://localhost:1337/users/validate';
  apiUrlLogout = 'http://localhost:1337/users//get/logout';

  constructor(private _http: HttpClient, private router: Router) {}

  loginUser(data: any): Observable<any> {
    return this._http.post(this.apiUrlLogin, data);
  }
  registerUser(data: any): Observable<any> {
    return this._http.post(this.apiUrlRegister, data);
  }
  validateUser(): Observable<any> {
    return this._http.get(this.apiUrlValidate);
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
