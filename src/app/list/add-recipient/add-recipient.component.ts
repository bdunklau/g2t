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

    // itemForm: FormGroup;  // guess we don't need this(?)
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

        await this.giftService.addRecipient(this.me, this.displayName, this.gift)


        this.router.navigate(['/view-list', this.gift.uid, this.gift.displayName, this.gift.phoneNumber])
    }

}
