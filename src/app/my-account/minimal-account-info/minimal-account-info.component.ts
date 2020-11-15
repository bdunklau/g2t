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


    onSubmit(/* not needed   form: NgForm*/) {
      this.user.displayName = this.nameValue;
      this.userService.updateUser(this.user).then(() => {
        this.router.navigate(['/home']);
      })
    }

}
