import { Component, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '@angular/common';
import { AuthService } from './core/auth.service';
// import { UserService } from './user/user.service';
import { Router } from "@angular/router";
import { MessageService } from './core/message.service';
import { Subscription } from 'rxjs';
// import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
// import { NgbDateFRParserFormatter } from "./util/date-chooser/ngb-date-fr-parser-formatter";
import { FirebaseUserModel } from './user/user.model';
import { UserService } from './user/user.service';
//import Hammer from 'hammerjs'; // to capture touch events
// import { BrowserModule } from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gift2Text.com';
  friends:{displayName: string}[]
  isLoggedIn = true
  isAdmin = true
  name_or_phone = "(Name here)"
  private userSubscription: Subscription;
  me: FirebaseUserModel


  constructor(private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService) {

    this.friends = [
      {displayName: 'Tamie'},
      {displayName: 'Truman'},
      {displayName: 'Jett'},
      {displayName: 'Kiera'},
    ]
  }


  async ngOnInit() {
    this.me = await this.userService.getCurrentUser();
    console.log('AppComponent:  user = ', this.me);
    if(this.me) {
        this.setAdmin(this.me.isAdmin())
        this.isLoggedIn = true;
        if(this.me.phoneNumber) this.name_or_phone = this.me.phoneNumber; // TODO not tested
        if(this.me.displayName) this.name_or_phone = this.me.displayName; // TODO not tested
        // if(this.me.photoURL) this.photoURL = this.me.photoURL             // TODO not tested
    }
    else {
        this.isLoggedIn = false
        this.name_or_phone = ""; // TODO not tested
        this.setAdmin(false); // TODO not tested   
    }

    var nxt = function(value /* FirebaseUserModel */) {
      console.log('AppComponent: next(): value = ', value);
      console.log('AppComponent: next(): this = ', this);
      if(value) this.setAdmin(value.isAdmin())
      if(value) this.isLoggedIn = true;
      if(value && value.phoneNumber) this.name_or_phone = value.phoneNumber; // TODO not tested
      if(value && value.displayName) this.name_or_phone = value.displayName; // TODO not tested
      if(value && value.photoURL) this.photoURL = value.photoURL             // TODO not tested
      if(!value) this.isLoggedIn = false;
      if(!value) this.name_or_phone = ""; // TODO not tested
      if(!value) this.setAdmin(false); // TODO not tested
    }.bind(this);

    this.userSubscription = this.messageService.listenForUser().subscribe({
          next: nxt,
          error: function(value) {
          },
          complete: function() {
          }
      })
  }

  // https://www.w3schools.com/howto/howto_js_sidenav.asp
  /* Set the width of the side navigation to 250px */
  openNav(event) {
    document.getElementById("mySidenav").style.width = "250px";
    // document.getElementById("thebody").addEventListener('click', this.closeNav, true);
    // document.body.addEventListener('click', this.fn, true);
    // document.body.addEventListener('click', function() {window.alert('body clicked')})
  }

  // https://www.w3schools.com/howto/howto_js_sidenav.asp
  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    // document.getElementById("thebody").removeEventListener('click', this.closeNav);
  }

  setAdmin(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }


  logout(){
    this.closeNav();
    this.authService.doLogout()
    .then((res) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.log("Logout error", error);
      }
    );
  }
  
}
