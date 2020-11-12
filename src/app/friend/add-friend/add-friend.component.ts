import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { UserService } from '../../user/user.service'
import { Router } from "@angular/router";
import { FirebaseUserModel } from '../../user/user.model';
import { MessageService } from 'src/app/core/message.service';


@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {

    friendForm: FormGroup;
    me: FirebaseUserModel
    friend: {displayName: string, phoneNumber: string} = {displayName: '', phoneNumber: ''}

    constructor(private userService: UserService,
                private messageService: MessageService,
                private router: Router) { }

    async ngOnInit() {
        this.me = await this.userService.getCurrentUser();
    }
      

    async onSubmit(/*form: NgForm*/) { 
        console.log('onSubmit()')
        this.friend.phoneNumber = '+1' + this.justNumbers(this.friend.phoneNumber)
        await this.userService.addFriend(this.me, this.friend)
        this.messageService.updateUser({user: this.me, event: 'friend added'})
        // send to /home
        this.router.navigate(['/home'])
    }

  
    validatePhoneNo(field) {
        var phoneNumDigits = field.value.replace(/\D/g, '');
      
        // this.isValidFlg = (phoneNumDigits.length==0 || phoneNumDigits.length == 10);
      
        var formattedNumber = phoneNumDigits;
        if (phoneNumDigits.length >= 6)
          formattedNumber = '(' + phoneNumDigits.substring(0, 3) + ') ' + phoneNumDigits.substring(3, 6) + '-' + phoneNumDigits.substring(6);
        else if (phoneNumDigits.length >= 3)
          formattedNumber = '(' + phoneNumDigits.substring(0, 3) + ') ' + phoneNumDigits.substring(3);
      
        field.value = formattedNumber;
        console.log('validatePhoneNo(): field.value = ', field.value)
    }


    justNumbers(value: string) {
        console.log('justNumbers(): value = ', value)
        let replaced = value.replace(/\D/g,''); //  \D = all non-digits 
        return replaced
    }

}
