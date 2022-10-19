import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginResponse } from 'src/app/Models/LoginResponse';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginResponse !: LoginResponse;
  form !: FormGroup;
  @ViewChild("span") span !: Element;
  get formControl() {
    return this.form.controls;
  }
  constructor(private loginService: LoginService, private formBuilder: FormBuilder) { }

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
        if (this.loginResponse.token.length > 0) {
          localStorage.setItem("token", this.loginResponse.token);
          console.log(localStorage.getItem("token"))
        }
      },
      error: () => { this.span.innerHTML = "an error occured,retry authentication" }
    })
  }

}
