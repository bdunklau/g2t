import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { FirebaseUserModel } from 'src/app/user/user.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-child',
  templateUrl: './add-child.component.html',
  styleUrls: ['./add-child.component.css']
})
export class AddChildComponent implements OnInit {

    me: FirebaseUserModel
    displayName: string

    constructor(private userService: UserService,
                private router: Router) { }

    async ngOnInit() {
    }

    async onSubmit(/*form: NgForm*/) { 
        this.me = await this.userService.getCurrentUser()
        await this.userService.addChild(this.me, this.displayName)
        this.router.navigate(['/my-account'])
    }


}
