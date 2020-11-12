import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../user/user.service'
import { /*Subject, Observable,*/ Subscription } from 'rxjs';
import { map /*, take */ } from 'rxjs/operators';
import { GiftService } from '../../gift/gift.service'
import { Gift } from '../../gift/gift.model'
import * as _ from 'lodash'



@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css']
})
export class ViewListComponent implements OnInit {

    listName: string
    private routeSubscription: Subscription;
    private giftSubscription: Subscription;
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
        let phoneNumber = this.route.snapshot.params.phoneNumber
        let me = await this.userService.getCurrentUser()
        this.listName = me.phoneNumber === phoneNumber ? "My List" : `${displayName}'s List`

        
        this.giftSubscription = this.giftService.getList({displayName: displayName, phoneNumber: phoneNumber}).pipe(
          map(actions => {
            console.log('actions = ', actions)
            return actions.map(a => {
              const data = a.payload.doc.data() as Gift;
              const id = a.payload.doc.id;
              var returnThis = { id, ...data };
              // console.log('returnThis = ', returnThis);
              return returnThis;
            });
          })
        )
          .subscribe(objs => {
            // need TeamMember objects, not Team's, because we need the leader attribute from TeamMember
            this.gifts = _.map(objs, obj => {
              let gift = obj as unknown;
              return gift as Gift;
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
        this.router.navigate(['/add-item'])
    }

}
