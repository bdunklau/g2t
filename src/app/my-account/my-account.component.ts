import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { FirebaseUserModel } from '../user/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

    me: FirebaseUserModel


    constructor(private userService: UserService,
                private router: Router) { }

    async ngOnInit() {
        this.me = await this.userService.getCurrentUser()
    }

    addChild() {
        console.log('addChild()')
        this.router.navigate(['/add-child'])
    }

    removeChild(me, child) {
        this.userService.removeChild(me, child)
    }

    switchAccounts(child) {
        console.log('child: ', child)
    }

}
