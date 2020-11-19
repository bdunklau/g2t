import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service'
import { FirebaseUserModel } from 'src/app/user/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-minimal-account-info',
  templateUrl: './minimal-account-info.component.html',
  styleUrls: ['./minimal-account-info.component.css']
})
export class MinimalAccountInfoComponent implements OnInit {

    user: FirebaseUserModel
    nameValue: string;

    constructor(
      private userService: UserService,
      private router: Router) { }

    async ngOnInit() {
        this.user = await this.userService.getCurrentUser()
    }


    async onSubmit(/* not needed   form: NgForm*/) {
      this.user.displayName = this.nameValue;
      await this.userService.updateUser(this.user)
      // NOW see if this user was added as a friend prior to account creationg
      // Query the friend collection:  where phoneNumber = this.user.phoneNumber - there could be more than one friend doc
      this.userService.checkForFriends(this.user)
      
      this.router.navigate(['/home']);
    }

}
