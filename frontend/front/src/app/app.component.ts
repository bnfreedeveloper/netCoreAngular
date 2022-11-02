import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front';

  username: string | null = localStorage.getItem("username");
  constructor(private auth: AuthenticationService) {
  }
  ngOnInit(): void {
    this.auth.fireDeletionUserName.subscribe(x => {
      if (x == true) this.deleteUserName();
      else this.username = localStorage.getItem("username")
    })
  }
  checkLoggedIn(): boolean {
    //return localStorage.getItem("token") != null;
    return this.auth.checkLoggedIn() as boolean;
  }
  deleteUserName(): void {
    this.username = "";
  }


}
