import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MessageService } from '../core/message.service';
import { Gift } from '../gift/gift.model'
import { FirebaseUserModel } from '../user/user.model';
import { take } from 'rxjs/operators';
import * as _ from 'lodash'
import firebase from 'firebase/app'



@Injectable({
  providedIn: 'root'
})
export class GiftService {

    shoppingCart: Gift[]

    constructor(
        private afs: AngularFirestore,
        // private http: HttpClient,
        public afAuth: AngularFireAuth,
        private messageService: MessageService,
        // private afStorage: AngularFireStorage
        ) { 


    }


    getList(args: {uid: string}) {
        
        var retThis = this.afs.collection('gift', ref => ref.where("uid", "==", args.uid)
                                                            .where("deleted", "==", false)
                                                            .orderBy('time_ms')).snapshotChanges();
        return retThis;
    }


    addGift(gift: Gift) {
        this.afs.collection('gift').add(gift.toObj())
    }

    async removeGift(gift: Gift) {
        if(gift.reserved) {
            await this.afs.collection('gift').doc(gift.docId).update({deleted: true})
        }
        else {
            await this.afs.collection('gift').doc(gift.docId).delete()
        }
    }

    async reserveGift(me: FirebaseUserModel, gift: Gift) {
        let batch = this.afs.firestore.batch();
        var userRef = this.afs.collection('user').doc(me.uid).ref;
        var giftRef = this.afs.collection('gift').doc(gift.docId).ref;
        batch.update(giftRef, {reserved: true, reserved_by_uid: me.uid, reserved_by_displayName: me.displayName, reserved_by_phoneNumber: me.phoneNumber, reserved_time_ms: new Date().getTime()})
        // batch.update(userRef, {shopping_cart_size: firebase.firestore.FieldValue.increment(1) }) // works but not necessary, and you have to query to get the new value
        me.shopping_cart_size = me.shopping_cart_size + 1
        batch.update(userRef, {shopping_cart_size: me.shopping_cart_size})
        await batch.commit();
        this.shoppingCart.push(gift)
        this.messageService.updateUser({user: me, event: 'update shopping cart size'})
    }


    async getShoppingCart(uid: string) {
        let observable = this.afs.collection('gift', ref => ref.where("reserved_by_uid", "==", uid)).snapshotChanges().pipe(take(1));
        let docChangeActions = await observable.toPromise()
        let gifts:Gift[] = []
        if(docChangeActions && docChangeActions.length > 0) {
            _.each(docChangeActions, obj => {
                let gift = obj.payload.doc.data() as Gift
                gift.docId = obj.payload.doc.id
                gifts.push(gift)
            })
        }
        console.log('shopping cart: ', gifts)
        return gifts
    }


    async returnItem(me: FirebaseUserModel, gift: Gift) {
        console.log("returnItem():  gift.docId = ", gift.docId)
        let batch = this.afs.firestore.batch()
        let userRef = this.afs.collection('user').doc(me.uid).ref
        let giftRef = this.afs.collection('gift').doc(gift.docId).ref
        batch.update(giftRef, {reserved: false, 
            reserved_by_uid: firebase.firestore.FieldValue.delete(), 
            reserved_by_displayName: firebase.firestore.FieldValue.delete(), 
            reserved_by_phoneNumber: firebase.firestore.FieldValue.delete(), 
            reserved_time_ms: firebase.firestore.FieldValue.delete()})
        me.shopping_cart_size = me.shopping_cart_size - 1
        batch.update(userRef, {shopping_cart_size: me.shopping_cart_size})
        await batch.commit()
        _.remove(this.shoppingCart, item => { return item.docId === gift.docId })
        this.messageService.updateUser({user: me, event: 'update shopping cart size'})
    }
    
}
