import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MessageService } from '../core/message.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
})
export class GiftService {

    constructor(
      private afs: AngularFirestore,
      // private http: HttpClient,
      public afAuth: AngularFireAuth,
      // private messageService: MessageService,
      // private afStorage: AngularFireStorage
      ) { }


    getList(args: {displayName: string, phoneNumber: string}) {
        
        var retThis = this.afs.collection('gift', ref => ref.where("displayName", "==", args.displayName)
                                                            .where("phoneNumber", "==", args.phoneNumber)
                                                            .where("deleted", "==", false)
                                                            /*.orderBy('created_ms')*/).snapshotChanges();
        return retThis;
    }

}
