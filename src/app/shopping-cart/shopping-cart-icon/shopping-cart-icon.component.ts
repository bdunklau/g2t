import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../user/user.service'
import { FirebaseUserModel } from 'src/app/user/user.model';
import { MessageService } from 'src/app/core/message.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-shopping-cart-icon',
  templateUrl: './shopping-cart-icon.component.html',
  styleUrls: ['./shopping-cart-icon.component.css']
})
export class ShoppingCartIconComponent implements OnInit {

    me: FirebaseUserModel
    private userSubscription: Subscription;
    isLoggedIn = false

    constructor(private userService: UserService,
                private messageService: MessageService) { }

    async ngOnInit() {
        this.me = await this.userService.getCurrentUser()

        var nxt = function(data /* {user: FirebaseUserModel, event: string} */) {
            this.me = data.user   // for the shopping cart count 
            if(this.me) this.isLoggedIn = true
            else this.isLoggedIn = false
        }.bind(this);


        this.userSubscription = this.messageService.listenForUser().subscribe({
              next: nxt,
              error: function(value) {
              },
              complete: function() {
              }
          })
    }


    ngOnDestroy() {
        if(this.userSubscription) this.userSubscription.unsubscribe()
    }

}
