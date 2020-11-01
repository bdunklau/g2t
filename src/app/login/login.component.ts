import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, of } from 'rxjs';
import { UserService } from '../user/user.service'
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui'
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { 

  //ui: firebaseui.auth.AuthUI

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private userService: UserService) { }


  ngOnInit() {
    console.log("login.component.ts: ngOnInit()")
    // firebase.initializeApp(environment.firebase)


    // if(isPlatformBrowser(this.platformId)) {
        // let firebase = await import('firebase')
        // let firebaseui = await import('firebaseui')
        console.log('firebaseui = ', firebaseui)


        /**
         * GOOD REFERENCE:  https://github.com/firebase/firebaseui-web#starting-the-sign-in-flow
         */
        let ui: firebaseui.auth.AuthUI
        
        let onLoginSuccessful = function() {
          var user = firebase.auth().currentUser;
          if(user){
            // this.log.i('login');
            this.userService.setFirebaseUser(user);
            this.userService.signIn(/*this.log,*/ user);
            this.router.navigate(['/home'])
          }
        }


        // see:  https://www.youtube.com/watch?v=vAX7PyhbU6s
        const uiConfig = {
          signInOptions: [
              firebase.auth.PhoneAuthProvider.PROVIDER_ID
          ],
          callbacks: {
              signInSuccessWithAuthResult: /*this.*/onLoginSuccessful.bind(this)
          },
        }

        // starts the firebase ui library

        //   this.ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.afAuth.auth);
        // /*this.*/ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.afAuth.auth);
        //*this.*/ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.afAuth/*.auth*/);
        // /*this.*/ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI({apiKey: "xxxxxx", options: "ssss"}/*this.afAuth*//*.auth*/);
        //*this.*/ui.start('#firebaseui-auth-container', uiConfig);
      

        try {
            // Code throwing an exception
            //ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.afAuth);
            console.log('firebase: ', firebase)
            console.log('firebase.auth(): ', firebase.auth())
            ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth()); //@see  https://github.com/firebase/firebaseui-web/issues/216#issuecomment-459302414
            console.log('did we get to ui.start() ????')
            ui.start('#firebaseui-auth-container', uiConfig);
        } catch(e) {
          console.log(e.stack);
        }


    // }

  }


}
