import { Injectable } from '@angular/core';
import { FirebaseUserModel } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessageService } from '../core/message.service';
// import * as firebase from 'firebase/app'
import firebase from 'firebase/app'
// import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import * as _ from 'lodash'



@Injectable({
  providedIn: 'root'
})
export class UserService {

    user: FirebaseUserModel;

    constructor(
      private afs: AngularFirestore,
      // private http: HttpClient,
      public afAuth: AngularFireAuth,
      private messageService: MessageService,
      private afStorage: AngularFireStorage,) { }


    async signIn(/*log: LogService,*/ firebase_auth_currentUser) {
      await this.setFirebaseUser(firebase_auth_currentUser, true);
      // log.i('login');
    }


    signOut() {
      // let user = new FirebaseUserModel();
      // this.user.online = false;
      // user.populate(this.user);
      // this.updateUser(user);
      // this.user = null
      // console.log('signOut(): this.user = ', this.user);
      // this.messageService.updateUser(this.user);
    }


    async setFirebaseUser(firebase_auth_currentUser, online: boolean) {
      let user:FirebaseUserModel = this.firebaseUserToFirebaseUserModel(firebase_auth_currentUser);
      this.user = new FirebaseUserModel();
      var userDoc = await this.afs.collection('user').doc(user.uid).ref.get();
      if(userDoc && userDoc.data()) {
        console.log('setFirebaseUser(): userDoc.data() = ', userDoc.data());
        this.user.populate(userDoc.data());
      }
      else {
        this.user.uid = user.uid
        this.user.phoneNumber = user.phoneNumber
      }
    }

    

    private firebaseUserToFirebaseUserModel(firebase_auth_currentUser):FirebaseUserModel {
      let user = new FirebaseUserModel();
      // if(firebase_auth_currentUser.providerData[0].providerId == 'password'){
      //   user.image = 'https://via.placeholder.com/400x300';
      // }
      // else{
      //   user.image = firebase_auth_currentUser.photoURL;
      // }
      console.log('firebase_auth_currentUser: ', firebase_auth_currentUser)
      user.displayName = firebase_auth_currentUser.displayName;
      // user.provider = firebase_auth_currentUser.providerData[0].providerId;
      if(firebase_auth_currentUser.phoneNumber) user.phoneNumber = firebase_auth_currentUser.phoneNumber;
      user.uid = firebase_auth_currentUser.uid;
      return user;
    }


    async updateUser(value: FirebaseUserModel) {
      let data = {}
      if(value.displayName) {
        data['displayName'] = value.displayName;
        data['displayName_lower'] = value.displayName.toLowerCase();
      }
      // data['isDisabled'] = value.isDisabled;
      // data['online'] = value.online === true ? true : false;
      // data['tosAccepted'] = value.tosAccepted === true ? true : false;
      // data['privacyPolicyRead'] = value.privacyPolicyRead === true ? true : false;
      let updateRes = this.afs.collection('user').doc(value.uid).ref.update(data);
      console.log('updateUser: DATABASE UPDATE: ', data);
      return updateRes;
    }


    async getCurrentUser() : Promise<FirebaseUserModel> {
      if(this.user) {
        console.log('getCurrentUser():  get cached user: ', this.user);
        return this.user
      }
      var user = await this.createFirebaseUserModel()
      .catch(function(error) {
        console.log('getCurrentUser():  error: ', error);
      })
  
      if(!user) {
        console.log('getCurrentUser() user = undefined so return early');
        return null;
      }
  
      return new Promise<FirebaseUserModel>(async (resolve, reject) => {
          var userDoc = await this.afs.collection('user').doc(user.uid).ref.get();
          this.user = user;
          this.user.populate(userDoc.data());
          
          // if(this.user.photoFileName) {
          //     console.log('this.user.photoFileName:  '+this.user.photoFileName)
          //     let photoURL = await this.afStorage.storage.refFromURL('gs://'+environment.firebase.storageBucket+'/'+this.user.photoFileName).getDownloadURL()
          //     this.user.photoURL = photoURL
          // }
  
          console.log('getCurrentUser(): DATABASE HIT this.user = ', this.user);
          this.messageService.updateUser({user: this.user, event: 'get user'}); // how app.component.ts knows we have a user now
          resolve(this.user);
      });
    }


    // create FirebaseUserModel from firebase.user
    private createFirebaseUserModel() : Promise<any> {
      return new Promise((resolve, reject) => {
        this.getFirebaseUser()
        .then(res => {
          // console.log("user.service.ts:resolve() res = ", res);
          let user:FirebaseUserModel = this.firebaseUserToFirebaseUserModel(res)
          return resolve(user);

        }, err => {
          console.log('createFirebaseUserModel(): error: ', err);
          return reject(err);
        })
      })
    }


    private getFirebaseUser() {
      return new Promise<any>((resolve, reject) => {
        var user = firebase.auth().onAuthStateChanged(function(user){
          if (user) {
            resolve(user);
          } else {
            reject('No user logged in');
          }
        })
      })
    }


    async addFriend(aUser: FirebaseUserModel, friend: {displayName: string, phoneNumber: string}) {

        let friendId = this.afs.createId();
        let batch = this.afs.firestore.batch();

        var userRef = this.afs.collection('user').doc(aUser.uid).ref;
        aUser.friends.push({displayName: friend.displayName, phoneNumber: friend.phoneNumber, friendId: friendId})
        batch.update(userRef, {friends: aUser.friends})

        var friendRef = this.afs.collection('friend').doc(friendId).ref;
        let friendObj = {creator_uid: aUser.uid, creator_name: aUser.displayName, 
          time_ms: new Date().getTime(), friend_phone: '+1'+friend.phoneNumber, friend_name: friend.displayName.trim(),
          friend_name_lower_case: friend.displayName.trim().toLowerCase()}

        batch.set(friendRef, friendObj);
        
        await batch.commit();

        if(aUser.uid === this.user.uid) this.user = aUser
    }


    async removeFriend(aUser: FirebaseUserModel, friend: {displayName: string, phoneNumber: string, friendId: string}) {
        
        _.remove(aUser.friends, fr => { return friend.friendId === fr.friendId })
        let batch = this.afs.firestore.batch()
        var userRef = this.afs.collection('user').doc(aUser.uid).ref
        batch.update(userRef, {friends: aUser.friends})
        
        var friendRef = this.afs.collection('friend').doc(friend.friendId).ref;
        batch.delete(friendRef)

        await batch.commit()

        if(aUser.uid === this.user.uid) this.user = aUser
    }


}
