import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../Models/LoginModel';
import { LoginResponse } from '../Models/LoginResponse';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl = environment.baseUrl + "authentication";
  constructor(private http: HttpClient) { }

  Login(form: LoginModel) {
    return this.http.post<LoginResponse>(this.baseUrl + "/login", form)
      .pipe(catchError(err => throwError(() => new Error(err))));
  }

}
