import { Injectable } from '@angular/core';
import { FirebaseUserModel } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private user: FirebaseUserModel;

    constructor(
      private afs: AngularFirestore,) { }


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
  
      // await this.afStorage.storage
      // .refFromURL('gs://'+environment.firebase.storageBucket+'/'+this.user.photoFileName)
      // .getDownloadURL().then(url => {
      //     console.log("this.photoURL = ", url)
      //     this.user.photoURL = url
      //     this.messageService.updateUser(this.user) // see app.component.ts:ngOnInit()
      //  })
  
      // this.user.online = online;
      // this.updateUser(this.user); // saves the online state
      // console.log('setFirebaseUser(): this.user = ', this.user);
      // this.messageService.updateUser(this.user); // how app.component.ts knows we have a user now
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


}
