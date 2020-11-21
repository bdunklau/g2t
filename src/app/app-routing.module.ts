import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ViewListComponent } from './list/view-list/view-list.component';
import { AddFriendComponent } from './friend/add-friend/add-friend.component'
import { AddItemComponent } from './list/add-item/add-item.component'
import { ViewListGuard } from './list/view-list/view-list.guard'
import { NoListNoAccountComponent } from './list/no-list-no-account/no-list-no-account.component'
import { ShoppingCartListComponent } from './shopping-cart/shopping-cart-list/shopping-cart-list.component'
import { MinimalAccountInfoGuard } from './my-account/minimal-account-info/minimal-account-info.guard';
import { MinimalAccountInfoComponent } from './my-account/minimal-account-info/minimal-account-info.component';
import { AddRecipientComponent } from './list/add-recipient/add-recipient.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'add-friend', component: AddFriendComponent },
  { path: 'add-recipient', component: AddRecipientComponent },
  { path: 'add-item/:uid/:displayName/:phoneNumber', component: AddItemComponent },
  { path: 'home', component: HomeComponent, canActivate: [MinimalAccountInfoGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'minimal-account-info', component: MinimalAccountInfoComponent },
  { path: 'no-list-no-account', component: NoListNoAccountComponent },
  { path: 'shopping-cart', component: ShoppingCartListComponent },
  { path: 'view-list/:uid/:displayName/:phoneNumber', component: ViewListComponent, canActivate: [ViewListGuard] },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
  providers: [
  ]
})
export class AppRoutingModule { }
