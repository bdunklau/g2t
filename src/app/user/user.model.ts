import * as _ from 'lodash';

export class FirebaseUserModel {
  uid: string; // the doc id
//   image: string;
  displayName: string;
  displayName_lowerCase: string;
//   provider: string;
  phoneNumber: string;
  roles: Array<String>;
  friends: {displayName: string, displayName_lowerCase: string, friendId?: string, phoneNumber: string; uid?: string}[] = []
  shopping_cart_size = 0
  // not really using this.  see my-account.component.ts
//   photoURL: string;
//   photoFileName: string;
  date_ms: number;
//   isDisabled: boolean = false;
//   online: boolean = false;
//   tosAccepted: boolean = false;
//   privacyPolicyRead: boolean = false;
  // teams: Team[];
//   RoomSid: string; // can only be in one room at a time
  promo_code?: string
  // IF YOU ADD MORE FIELDS HERE, YOU HAVE TO ADD THEM TO populate() BELOW ALSO


  constructor(){
    this.uid = "";
    // this.image = "";
    this.displayName = "";
    this.displayName_lowerCase = "";
    this.date_ms = 0;
    // this.provider = "";
    this.phoneNumber = "";
    this.roles = [];
    this.friends = [];
    // not really using this.  see my-account.component.ts
    // this.photoURL = "";  
    // this.photoFileName = "thumb_profile-pic-default.png";
    // this.isDisabled = false;
    // this.online = false;
    // this.tosAccepted = false;
    // this.privacyPolicyRead = false;
    // this.teams = [];

  }

  populate(obj) {
    this.uid = obj.uid;
    // this.image = obj.image;
    this.displayName = obj.displayName;
    this.displayName_lowerCase = obj.displayName_lowerCase;
    this.date_ms = obj.date_ms;
    // this.provider = obj.provider;
    this.phoneNumber = obj.phoneNumber;
    this.roles = obj.roles;
    this.friends = obj.friends ? obj.friends : []
    this.shopping_cart_size = obj.shopping_cart_size ? obj.shopping_cart_size : 0
    // not really using this.  see my-account.component.ts
    // this.photoURL = obj.photoURL ? obj.photoURL : '';
    // this.photoFileName = obj.photoFileName ? obj.photoFileName : 'thumb_profile-pic-default.png';
    // this.online = obj.online; 
    // this.tosAccepted = obj.tosAccepted;
    // this.privacyPolicyRead = obj.privacyPolicyRead;
    // if(obj.isDisabled === true || obj.isDisabled === false) this.isDisabled = obj.isDisabled;
    // else this.isDisabled = false;
    if(obj.promo_code) this.promo_code = obj.promo_code
    // console.log('populate: this = ', this);
  }


  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  hasRole(role: string): boolean {
    var idx = _.findIndex(this.roles, function(o) { return o == role; });
    return idx != -1
  }

  
  
}
