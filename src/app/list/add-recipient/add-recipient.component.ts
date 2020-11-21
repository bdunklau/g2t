import { Component, OnInit } from '@angular/core';
import { Gift } from '../../gift/gift.model'
import { FormGroup } from "@angular/forms";
import { FirebaseUserModel } from 'src/app/user/user.model';
import * as _ from 'lodash'
import { GiftService } from 'src/app/gift/gift.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-recipient',
  templateUrl: './add-recipient.component.html',
  styleUrls: ['./add-recipient.component.css']
})
export class AddRecipientComponent implements OnInit {

    itemForm: FormGroup;
    gift: Gift
    me: FirebaseUserModel
    displayName: string


    constructor(private giftService: GiftService,
                private router: Router) { }

    ngOnInit() {
        let gft = history.state.gift // toObj() doesn't get serialized or whatever, so...
        this.gift = new Gift()
        this.gift.clone(gft)
        this.me = history.state.me
        console.log('ngOnInit()  CHECK:  gift = ', this.gift)
    }


    async onSubmit(/*form: NgForm*/) { 
        // /**
        //  * I'm only going to let you choose from YOUR friends, not the friends of the person's list your looking at
        //  * that would make more sense but I don't want to do the query
        //  */
        // let friend = _.find(this.me.friends, fr => { return fr.displayName_lowerCase.startsWith(this.displayName.toLowerCase().trim()) })
        // if(!friend) {
        //     // no friend - can't do anything
        //     return
        // }

        // let newGift = new Gift()        
        // newGift.added_by_uid = this.gift.added_by_uid
        // newGift.deleted = this.gift.deleted
        // newGift.deliver_ms = this.gift.deliver_ms
        // newGift.displayName = friend.displayName
        // newGift.docId = this.giftService.createId()
        // newGift.item = this.gift.item
        // newGift.link = this.gift.link
        // newGift.otherRecipients = []
        // newGift.otherRecipients.push({giftId: this.gift.docId, displayName: this.gift.displayName, phoneNumber: this.gift.phoneNumber, uid: this.gift.uid})
        // newGift.phoneNumber = friend.phoneNumber
        // newGift.reserved = this.gift.reserved
        // newGift.reserved_by_displayName = this.gift.reserved_by_displayName
        // newGift.reserved_by_phoneNumber = this.gift.reserved_by_phoneNumber
        // newGift.reserved_by_uid = this.gift.reserved_by_uid
        // newGift.reserved_time_ms = this.gift.reserved_time_ms
        // newGift.time_ms = this.gift.time_ms
        // newGift.uid = friend.uid

        // /**
        //  * What if this is the THIRD recipient?  Then, the 'otherRecipients' will already have another recipient in there
        //  * And we will have to save 3 new/updated gifts.  saveGifts([]) will have n elements
        //  */


        // if(!this.gift.otherRecipients) this.gift.otherRecipients = []
        // this.gift.otherRecipients.push({giftId: newGift.docId, displayName: friend.displayName, phoneNumber: friend.phoneNumber, uid: friend.uid})
    
        // await this.giftService.saveGifts([this.gift, newGift])


        await this.giftService.addRecipient(this.me, this.displayName, this.gift)


        this.router.navigate(['/view-list', this.gift.uid, this.gift.displayName, this.gift.phoneNumber])
    }

}
