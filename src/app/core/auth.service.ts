import { Injectable } from "@angular/core";
//import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
// import * as firebase from 'firebase/app'
import firebase from 'firebase/app'
// import { LogService } from '../log/log.service'
import { UserService } from '../user/user.service'
import { MessageService } from '../core/message.service';

@Injectable()
export class AuthService {

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    // private log: LogService,
    private userService: UserService,
    private messageService: MessageService,
 ){}

  doPhoneLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.PhoneAuthProvider();
      // this.afAuth.auth
      this.afAuth   //.auth  // .auth will go away when you upgrade @angular/fire
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogout() {
    return new Promise(async (resolve, reject) => {    
      await this.userService.signOut();
      this.userService.user = null
      this.messageService.updateUser({user: this.userService.user, event: 'logout'});

      var user = firebase.auth().currentUser
      if(user) { 
        // this.afAuth.auth
        this.afAuth  //  .auth  // .auth will go away when you upgrade @angular/fire
        .signOut().then(() => {
          // this.userService.signOut();
        });
      }
      resolve();
    });
  }


}
