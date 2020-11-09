import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FirebaseUserModel } from '../user/user.model';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private userListener = new Subject<FirebaseUserModel>();
  

  constructor() { }
  

  getUser(): Observable<FirebaseUserModel> {
     return this.userListener.asObservable();
  }


  listenForUser() {
    return this.userListener;
  }

  updateUser(user: FirebaseUserModel) {
    this.userListener.next(user);
  }

 


}
