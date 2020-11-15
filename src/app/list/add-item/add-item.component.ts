import { Component, OnInit } from '@angular/core';
import { GiftService } from '../../gift/gift.service'
import { FormGroup } from "@angular/forms";
import { Gift } from '../../gift/gift.model'
import { UserService } from '../../user/user.service'
import { FirebaseUserModel } from 'src/app/user/user.model';
import { ActivatedRoute, Router/*, NavigationEnd*/ } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';  // ref:   https://angular.io/guide/http


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

    itemForm: FormGroup;
    gift: Gift
    me: FirebaseUserModel
    amazonLink: string


    constructor(private giftService: GiftService,
      private route: ActivatedRoute,
      private userService: UserService,
      private router: Router) { }


    async ngOnInit() {
        this.me = await this.userService.getCurrentUser()
        this.gift = new Gift()
        this.me = await this.userService.getCurrentUser();
        this.gift.uid = this.route.snapshot.params.uid
    }


    async onSubmit(/*form: NgForm*/) { 
      this.gift.added_by_uid = this.me.uid
      this.gift.deleted = false
      this.gift.displayName = this.route.snapshot.params.displayName
      this.gift.phoneNumber = this.route.snapshot.params.phoneNumber
      this.gift.reserved = false
      this.gift.time_ms = new Date().getTime()
      console.log('this.gift = ', this.gift)
      this.giftService.addGift(this.gift)
      this.router.navigate(['/view-list', this.route.snapshot.params.uid, this.route.snapshot.params.displayName, this.route.snapshot.params.phoneNumber])
    }

    onKeyupEvent(event) {
        console.log('onKeyupEvent():  gift.item = ', this.gift.item)
        if(this.gift.item.length > 0) {
            // call amazon and see what they return
            this.amazonLink = 'https://www.amazon.com/s?k='+this.gift.item
        }
    }


}
