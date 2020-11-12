import { Component, OnInit } from '@angular/core';
import { GiftService } from '../../gift/gift.service'
import { FormGroup } from "@angular/forms";
import { Gift } from '../../gift/gift.model'
import { UserService } from '../../user/user.service'
import { FirebaseUserModel } from 'src/app/user/user.model';
import { ActivatedRoute, Router/*, NavigationEnd*/ } from '@angular/router';


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

    itemForm: FormGroup;
    gift: Gift
    me: FirebaseUserModel


    constructor(private giftService: GiftService,
      private route: ActivatedRoute,
      private userService: UserService,
      private router: Router) { }


    async ngOnInit() {
        this.me = await this.userService.getCurrentUser();
        if(this.route.snapshot.params.uid && this.route.snapshot.params.uid !== 'undefined') {
            
        }
    }


    async onSubmit(/*form: NgForm*/) { 
      // console.log('onSubmit()')
      // this.friend.phoneNumber = this.justNumbers(this.friend.phoneNumber)
      // await this.userService.addFriend(this.me, this.friend)
      // this.messageService.updateUser({user: this.me, event: 'friend added'})
      // // send to /home
      // this.router.navigate(['/home'])
    }

}
