import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FirebaseUserModel } from '../user/user.model';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private userListener = new Subject<{user: FirebaseUserModel, event: string}>();
  

  constructor() { }
  

  getUser(): Observable<{user: FirebaseUserModel, event: string}> {
     return this.userListener.asObservable();
  }


  listenForUser() {
    return this.userListener;
  }

  updateUser(arg: {user: FirebaseUserModel, event: string}) {
    this.userListener.next(arg);
  }

 


}
