import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { FirebaseUserModel } from '../user/user.model';
import * as _ from 'lodash'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
      private afs: AngularFirestore,) { }

    async ngOnInit() {

        /**
         * temp code that sets all gift.surprise = false
         */
        // let batch = this.afs.firestore.batch()
        // let observable = this.afs.collection('gift', ref => ref.where("time_ms", ">", 0)).snapshotChanges().pipe(take(1))
        // let docChangeActions = await observable.toPromise()
        // if(docChangeActions && docChangeActions.length > 0) {
        //     _.each(docChangeActions, obj => {
        //         let giftRef = this.afs.collection('gift').doc(obj.payload.doc.id).ref
        //         batch.update(giftRef, {surprise: false})
        //     })
        //     batch.commit()
        // }




        /**
         * Temp code - fills in uid's of friends in each user's friends list
         * BEWARE - THE CODE BELOW QUERIES ALL USERS
         */

        // let observable = this.afs.collection('user', ref =>  ref.where('time_ms', '>', 0)).snapshotChanges().pipe(take(1));
        // let docChangeActions = await observable.toPromise()
        // let users:FirebaseUserModel[] = []
        // if(docChangeActions && docChangeActions.length > 0) {
        //     _.each(docChangeActions, obj => {
        //         let user = obj.payload.doc.data() as FirebaseUserModel
        //         users.push(user)
        //     })
        // }

        // /**
        //  * for each user, look thru all friends
        //  * See if any friend does not have a uid that SHOULD have uid because the user now exists
        //  */
        // console.log('FOUND ANYONE?...')
        // _.each(users, async user => {
        //     _.each(user.friends, fr => {
        //         if(!fr.uid) {
        //             // go see if this user exists...
        //             let foundUser = _.find(users, usr => { return usr.displayName_lowerCase === fr.displayName_lowerCase && usr.phoneNumber === fr.phoneNumber })
        //             if(foundUser) { 
        //                 fr.uid = foundUser.uid
        //                 console.log('FOUND USER: ',fr.displayName)
        //             }
        //         }
        //     })
        //     await this.afs.collection('user').doc(user.uid).update({friends: user.friends})
        // })
        // console.log('FOUND ANYONE?... END')

        // console.log('returning users: ', users)
        // return users
    }

}
