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


    private affiliateLink(gift: Gift) {
        if(gift.link && gift.link.trim() !== '' && gift.link.indexOf('amazon.com') !== -1) {
            gift.link = gift.link.trim()
            if(!gift.link.startsWith('https://') && !gift.link.startsWith('http://')) {
                gift.link = 'https://'+gift.link
            }
            let noParms = gift.link.indexOf('?') === -1
            if(noParms) {
                gift.link = gift.link + '?tag=gift2text-20'
            }
            else {
                // some other aff link - replace it
                let baseUrl = gift.link.substring(0, gift.link.indexOf('?'))
                gift.link = baseUrl + '?tag=gift2text-20'
            }
        }
        return gift
    }



    addGift(gift: Gift) { 
        gift = this.affiliateLink(gift)
        this.afs.collection('gift').add(gift.toObj())
    }

    async removeGift(gift: Gift) {
        /**
         * joint gift?
         */
        let isJointGift = gift.otherRecipients && gift.otherRecipients.length > 0
        let otherGiftIds = _.map(gift.otherRecipients, rec => rec.giftId)

        if(gift.reserved) {
            await this.afs.collection('gift').doc(gift.docId).update({deleted: true})
            _.each(otherGiftIds, async giftId => { await this.afs.collection('gift').doc(giftId).update({deleted: true}) })
        }
        else {
            await this.afs.collection('gift').doc(gift.docId).delete()
            _.each(otherGiftIds, async giftId => { await this.afs.collection('gift').doc(giftId).delete() })
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


    createId() {
        return this.afs.createId()
    }


    // private async saveGifts(gifts: Gift[]) {
    //     _.each(gifts, async gift => {
    //         await this.afs.collection('gift').doc(gift.docId).set(gift.toObj());
    //     })
    // }


    async removeRecipient(args: {gift: Gift, recipient: any}) {
        _.remove(args.gift.otherRecipients, other => { return other.uid === args.recipient.uid })

        _.each(args.gift.otherRecipients, other => { 
            this.afs.collection('gift').doc(other.giftId).update({otherRecipients: args.gift.otherRecipients})
        })

        // finally, remove gift having recipient.giftId
        this.afs.collection('gift').doc(args.recipient.giftId).delete()

    }


    async addRecipient(me: FirebaseUserModel, displayName: string, gift: Gift) {
        console.log('addRecipient()  CHECK:  gift = ', gift)

        let allRecipients = gift.otherRecipients
        let presentAlready = _.find(allRecipients, {giftId: gift.docId, displayName: gift.displayName, phoneNumber: gift.phoneNumber, uid: gift.uid})
        if(!presentAlready)
            allRecipients.push({giftId: gift.docId, displayName: gift.displayName, phoneNumber: gift.phoneNumber, uid: gift.uid}) // sort of redundant/unecessary
        
        /**
         * I'm only going to let you choose from YOUR friends, not the friends of the person's list your looking at
         * that would make more sense but I don't want to do the query
         */
        let friend = _.find(me.friends, fr => { return fr.displayName_lowerCase.startsWith(displayName.toLowerCase().trim()) })
        if(!friend) {
            // no friend - can't do anything
            return
        }

        let newGift = new Gift()        
        newGift.added_by_uid = gift.added_by_uid
        newGift.deleted = gift.deleted
        newGift.deliver_ms = gift.deliver_ms
        newGift.displayName = friend.displayName
        newGift.docId = this.createId()
        newGift.item = gift.item
        newGift.link = gift.link
        newGift.phoneNumber = friend.phoneNumber
        newGift.reserved = gift.reserved
        newGift.reserved_by_displayName = gift.reserved_by_displayName
        newGift.reserved_by_phoneNumber = gift.reserved_by_phoneNumber
        newGift.reserved_by_uid = gift.reserved_by_uid
        newGift.reserved_time_ms = gift.reserved_time_ms
        newGift.time_ms = gift.time_ms
        newGift.uid = friend.uid
        
        // go ahead and add this new recipient to his own list of 'otherRecipients'
        allRecipients.push({giftId: newGift.docId, displayName: newGift.displayName, phoneNumber: newGift.phoneNumber, uid: newGift.uid})
        newGift.otherRecipients = allRecipients

        // all recipients now actually contain themselves - we'll filter out the me's in the view component or ngFor loop

        // now save the new gift
        await this.afs.collection('gift').doc(newGift.docId).set(newGift.toObj()) // not sure if we need await here

        _.each(allRecipients, recipient => {
            this.afs.collection('gift').doc(recipient.giftId).update({otherRecipients: allRecipients})
        })

    }


    /**
     * temp function
     */
    async fix(gift: Gift) {
        await this.afs.collection('gift').doc(gift.docId).update({added_by_uid: gift.uid})
    }
    
}
