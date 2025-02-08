import { Routes } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {RegisterComponent} from "./component/register/register.component";
import {AppComponent} from "./app.component";
import {HomeComponent} from "./component/home/home.component";
import {CollectionComponent} from "./component/collection/collection.component";
import {RequestComponent} from "./component/request/request.component";
import {ProfileComponent} from "./component/profile/profile.component";
import {authGuard} from "./guards/auth.guard";
import {particulierGuard} from "./guards/particulier.guard";
import {logoutGuard} from "./guards/logout.guard";

export const routes: Routes = [
  {path: "home", component: HomeComponent },
  {path: "", component: HomeComponent },
  { path: 'login', component: LoginComponent ,canActivate:[logoutGuard] },
  { path: 'register', component: RegisterComponent ,canActivate:[logoutGuard]},
  { path: 'collection', component: CollectionComponent , canActivate:[authGuard,particulierGuard] },
  {path: 'requests', component: RequestComponent,  canActivate:[authGuard]  },
  {path: 'profile/:id', component: ProfileComponent , canActivate:[authGuard]  },
];
