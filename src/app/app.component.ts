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
  isLoggedIn = false
  isAdmin = true
  name_or_phone = "(Name here)"
  private userSubscription: Subscription;
  me: FirebaseUserModel


  constructor(private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService) {
  }


  async ngOnInit() {
    this.me = await this.userService.getCurrentUser();
    console.log('AppComponent:  user = ', this.me);
    if(this.me) {
        this.setAdmin(this.me.isAdmin())
        this.isLoggedIn = true;
        if(this.me.phoneNumber) this.name_or_phone = this.me.phoneNumber; 
        if(this.me.displayName) this.name_or_phone = this.me.displayName; 
        // if(this.me.photoURL) this.photoURL = this.me.photoURL            
    }
    else {
        this.isLoggedIn = false
        this.name_or_phone = ""; 
        this.setAdmin(false);  
    }

    var nxt = function(data /* {user: FirebaseUserModel, event: string} */) {
      console.log('AppComponent: next(): value = ', data);
      console.log('AppComponent: next(): this = ', this);
      if(data.user) this.setAdmin(data.user.isAdmin())
      if(data.user) this.isLoggedIn = true;
      if(data.user && data.user.phoneNumber) this.name_or_phone = data.user.phoneNumber; 
      if(data.user && data.user.displayName) this.name_or_phone = data.user.displayName; 
      if(data.user && data.user.photoURL) this.photoURL = data.user.photoURL         
      if(!data.user) this.isLoggedIn = false;
      if(!data.user) this.name_or_phone = ""; 
      if(!data.user) this.setAdmin(false);
      if(data.event === 'login') this.me = data.user
      if(data.event === 'friend added') this.openNav()

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
  openNav() {
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

  addSomeone() {
      this.closeNav();
      this.router.navigate(['/add-friend'])
  }

  removeFriend(friend) {
      this.userService.removeFriend(this.me, friend)
  }
  
}
