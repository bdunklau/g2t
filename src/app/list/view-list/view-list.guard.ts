import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ViewListGuard implements CanActivate {

    constructor(
      private router: Router,
    ) {}


    /**
     * Look at uid path param - it may be 'undefined'
     * @param next 
     * @param state 
     */
    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {

        if(next.params.uid === 'undefined') {
            this.router.navigate(['/no-list-no-account'])
            return false
        }
        else return true


    }
}
