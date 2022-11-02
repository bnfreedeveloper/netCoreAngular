import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private auth: AuthenticationService) { }

  ngOnInit(): void {
    // localStorage.removeItem("token");
    // localStorage.removeItem("username");
    this.auth.removeItems();
    this.auth.deleteUserName();
    this.router.navigate(["/login"]);
  }

}
