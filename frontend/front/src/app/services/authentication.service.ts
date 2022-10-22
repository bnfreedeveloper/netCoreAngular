import { Injectable } from '@angular/core';
import { LoginResponse } from '../Models/LoginResponse';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  checkLoggedIn() {
    return this.checkLocalStorage() && this.checkTokenExpired();
  }
  //to check whatever we may need
  checkLocalStorage() {
    return localStorage.getItem("token");
  }
  checkTokenExpired() {

    //to get the payload of the jwt
    let token: string = JSON.stringify(localStorage.getItem("token"));
    let tokenString: string = JSON.stringify(jwt_decode(token));
    let tokenObject: any = JSON.parse(tokenString);
    let dateExpiration = tokenObject.expires;
    return Math.floor((new Date().getTime()) / 1000).toString() >= dateExpiration;
  }
  removeItems() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }
  constructor() { }
}
