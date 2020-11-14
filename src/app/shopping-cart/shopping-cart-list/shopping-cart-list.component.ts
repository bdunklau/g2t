import { Component, OnInit } from '@angular/core';
import { Gift } from '../../gift/gift.model'
import { GiftService } from '../../gift/gift.service';
import { UserService } from '../../user/user.service';
import { Router } from "@angular/router";
import * as _ from 'lodash'


@Component({
  selector: 'app-shopping-cart-list',
  templateUrl: './shopping-cart-list.component.html',
  styleUrls: ['./shopping-cart-list.component.css']
})
export class ShoppingCartListComponent implements OnInit {
  
    gifts: Gift[]

    constructor(private giftService: GiftService,
                private router: Router,
                private userService: UserService) { }

    async ngOnInit() {
        if(this.giftService.shoppingCart) this.gifts = this.giftService.shoppingCart
        else {
            // query for the shopping cart
            let me = await this.userService.getCurrentUser()
            this.gifts = await this.giftService.getShoppingCart(me.uid)
            this.giftService.shoppingCart = this.gifts
        }
    }


    async returnItem(gift: Gift) {
        let me = await this.userService.getCurrentUser()
        await this.giftService.returnItem(me, gift)
        _.remove(this.gifts, gf => { return gf.docId === gift.docId })
    }

}
