import { Injectable } from '@angular/core';
import { LoginResponse } from '../Models/LoginResponse';
import jwt_decode from "jwt-decode";
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  checkLoggedIn() {
    return this.checkLocalStorage() != null;
  }
  //to check whatever we may need
  checkLocalStorage() {
    return localStorage.getItem("token");
  }
  checkTokenExpired() {

    if (!this.checkLocalStorage()) return false;
    //to get the payload of the jwt
    let token: string = JSON.stringify(localStorage.getItem("token"));
    let tokenString: string = JSON.stringify(jwt_decode(token));
    let tokenObject: any = JSON.parse(tokenString);
    let dateExpiration = tokenObject.exp;
    let current = Math.floor((new Date().getTime()) / 1000);
    let check: boolean = current <= dateExpiration;
    return check;
  }
  removeItems() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }
  fireDeletionUserName: Subject<boolean> = new Subject<boolean>();

  deleteUserName() {
    this.fireDeletionUserName.next(true)
  }
  checkUserName() {
    this.fireDeletionUserName.next(false);
  }
  constructor() { }
}
