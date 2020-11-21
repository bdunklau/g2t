import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
// import * as firebase from 'firebase/app'
import firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import { LoginComponent } from './login/login.component';
import {FirebaseUIModule/*, firebase, firebaseui*/} from 'firebaseui-angular';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HomeComponent } from './home/home.component';
import { AuthService } from './core/auth.service';
import { ViewListComponent } from './list/view-list/view-list.component';
import { AddFriendComponent } from './friend/add-friend/add-friend.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddItemComponent } from './list/add-item/add-item.component';
import { NoListNoAccountComponent } from './list/no-list-no-account/no-list-no-account.component';
import { ShoppingCartIconComponent } from './shopping-cart/shopping-cart-icon/shopping-cart-icon.component';
import { ShoppingCartListComponent } from './shopping-cart/shopping-cart-list/shopping-cart-list.component';
import { MinimalAccountInfoComponent } from './my-account/minimal-account-info/minimal-account-info.component';
import { DateChooserComponent } from './util/date-chooser/date-chooser.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddRecipientComponent } from './list/add-recipient/add-recipient.component'; // https://ng-bootstrap.github.io/#/getting-started



const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  tosUrl: '/terms',
  privacyPolicyUrl: '/privacy',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ViewListComponent,
    AddFriendComponent,
    AddItemComponent,
    NoListNoAccountComponent,
    ShoppingCartIconComponent,
    ShoppingCartListComponent,
    MinimalAccountInfoComponent,
    DateChooserComponent,
    AddRecipientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    NgbModule.forRoot(),
    FormsModule, ReactiveFormsModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
