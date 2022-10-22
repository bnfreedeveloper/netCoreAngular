import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/Models/LoginResponse';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginResponse !: LoginResponse;
  form !: FormGroup;
  @ViewChild("test") span !: ElementRef<HTMLElement>;
  get formControl() {
    return this.form.controls;
  }
  constructor(private loginService: LoginService, private formBuilder: FormBuilder, private router: Router, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      "userName": ["", Validators.required],
      "password": ["", Validators.required]
    })
  }
  onSubmitForm() {
    this.loginService.Login(this.form.value).subscribe({
      next: (resp) => {
        this.loginResponse = resp;
        if (this.loginResponse.token.length > 0 && this.loginResponse.success) {
          localStorage.setItem("token", this.loginResponse.token);
          localStorage.setItem("username", this.loginResponse.userName)
          //console.log(localStorage.getItem("token"))
          console.log(this.auth.checkTokenExpired())
          this.router.navigate(["/employee"]);
          this.form.reset();
        }
        else {
          this.span.nativeElement.innerHTML = "an error occured,retry authentication",
            console.log("rrrr")
        }
      },
      error: (e) => { this.span.nativeElement.innerHTML = "an error occured,retry authentication"; console.log("error") }
    })
  }

}
