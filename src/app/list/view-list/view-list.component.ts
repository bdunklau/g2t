import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../user/user.service'
import { /*Subject, Observable,*/ Subscription } from 'rxjs';
import { map /*, take */ } from 'rxjs/operators';
import { GiftService } from '../../gift/gift.service'
import { Gift } from '../../gift/gift.model'
import * as _ from 'lodash'
import { FirebaseUserModel } from 'src/app/user/user.model';



@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css']
})
export class ViewListComponent implements OnInit {

    listName: string
    private routeSubscription: Subscription;
    private giftSubscription: Subscription;
    me: FirebaseUserModel
    gifts: Gift[]

    constructor(private route: ActivatedRoute,
                private router: Router,
                private giftService: GiftService,
                private userService: UserService) { 



        // re-evaluate path parameters without leaving the page or reloading
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
        
        // re-evaluate path parameters without leaving the page or reloading
        this.routeSubscription = this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            // Trick the Router into believing it's last link wasn't previously loaded
            this.router.navigated = false;
          }
        });

    }

    async ngOnInit() {
        let displayName = this.route.snapshot.params.displayName
        let uid = this.route.snapshot.params.uid
        this.me = await this.userService.getCurrentUser()
        this.listName = this.me.uid === uid ? "My List" : `${displayName}'s List`
        
        this.giftSubscription = this.giftService.getList({uid: uid}).pipe(
          map(actions => {
            console.log('actions = ', actions)
            return actions.map(a => {
              const data = a.payload.doc.data() as Gift;
              const id = a.payload.doc.id;
              var returnThis = { id, ...data };
              console.log('returnThis = ', returnThis);
              return returnThis;
            });
          })
        )
          .subscribe(objs => {
            // need TeamMember objects, not Team's, because we need the leader attribute from TeamMember
            this.gifts = _.map(objs, obj => {
              let gf = obj as unknown;
              let gift = gf as Gift;
              gift.docId = obj.id
              return gift // <-- don't forget this part ;)  otherwise you'll have an array of undefined's  ;)
            })
            console.log('this.gifts = ', this.gifts)
          });
    }


    ngOnDestroy() {
        if(this.routeSubscription) {
            this.routeSubscription.unsubscribe()
        }
        if(this.giftSubscription) {
            this.giftSubscription.unsubscribe()
        }
    }


    addItem() {
        this.router.navigate(['/add-item', this.route.snapshot.params.uid, this.route.snapshot.params.displayName, this.route.snapshot.params.phoneNumber])
    }

    async removeGift(gift: Gift) {
        await this.giftService.removeGift(gift)
        _.remove(this.gifts, gf => { return gf.docId === gift.docId })
    }


    canDelete(gift: Gift) {
        let canDel = gift.added_by_uid === this.me.uid
        // console.log('canDelete(): gift = ', gift, '  canDel = ', canDel)
        return canDel
    }


    canReserve(gift: Gift) {
        // can't buy if it's for me
        if(this.me.uid === gift.uid) {
            return false
        }
        // can't buy if it's already bought
        else if(gift.reserved) {
            return false
        }
        // can buy if it's for someone else
        else return true
    }


    reserveGift(gift: Gift) {
        this.giftService.reserveGift(this.me, gift)
    }



}
