import { Component, OnInit } from '@angular/core';
import { GiftService } from '../../gift/gift.service'
import { FormGroup } from "@angular/forms";
import { Gift } from '../../gift/gift.model'
import { UserService } from '../../user/user.service'
import { FirebaseUserModel } from 'src/app/user/user.model';
import { ActivatedRoute, Router/*, NavigationEnd*/ } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';  // ref:   https://angular.io/guide/http
import * as moment from 'moment';


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
    defaultFrom: Date
    // defaultTo: string;
    dates: any;


    constructor(private giftService: GiftService,
      private route: ActivatedRoute,
      private userService: UserService,
      private router: Router) { }


    async ngOnInit() {
        this.me = await this.userService.getCurrentUser()
        this.gift = new Gift()
        this.gift.uid = this.route.snapshot.params.uid
        this.gift.displayName = this.route.snapshot.params.displayName
        this.defaultFrom = new Date()
        this.defaultFrom.setMonth(11); this.defaultFrom.setDate(25); this.defaultFrom.setHours(23); this.defaultFrom.setMinutes(59); this.defaultFrom.setSeconds(0)

        let forSomeoneElse = this.me.uid !== this.gift.uid
        if(forSomeoneElse) {
            this.gift.surprise = true
        }
    }


    async onSubmit(/*form: NgForm*/) { 
      this.gift.added_by_uid = this.me.uid
      this.gift.deleted = false
      if(!this.gift.deliver_ms) {
          var d = new Date()
          d.setMonth(11); d.setDate(25); d.setHours(23); d.setMinutes(59); d.setSeconds(0)
          this.gift.deliver_ms = d.getTime()
      }
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
    

    public onDateRangeSelection(range: { from: Date/*, to: Date*/ }) {
      // Add 1 day since times are midnight
      // subtract 1 minute so that the day number will still be correct when MM/dd format
      var plus1Day = moment(range.from).add(1, 'days').subtract(1, 'minute').toDate()
      this.gift.deliver_ms = plus1Day.getTime()
      
      // if(range && range.to && range.from) {
      //   var plus1Day = moment(range.to).add(1, 'days').toDate()
      //   this.dates = {date1: range.from.getTime(), date2: plus1Day.getTime()};
      //   this.log$.next(this.dates);
      //   console.log('onDateRangeSelection: this.level = ', this.level, ' this.dates = ', this.dates);
      //   this.page.init('log_'+this.level, this.queryInitial.bind(this), this.querySubsequent.bind(this), {reverse: this.reverse, prepend: this.prepend /* why false? */});
      // }
    }


}
