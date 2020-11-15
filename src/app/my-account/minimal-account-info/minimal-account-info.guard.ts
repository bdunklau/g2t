import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
import { FirebaseUserModel } from 'src/app/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class MinimalAccountInfoGuard implements CanActivate {

  constructor(
      public userService: UserService,
      private router: Router,
  ) {}


  async canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Promise<boolean> {

      var user = await this.userService.getCurrentUser();
      let nameExists = user && user.displayName && user.displayName.trim() !== ''
      if(!nameExists) {
        this.router.navigate(['/minimal-account-info']);
        return false;
      }
      else return true;
  }
  
  
}
