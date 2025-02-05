import { Routes } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {RegisterComponent} from "./component/register/register.component";
import {AppComponent} from "./app.component";
import {HomeComponent} from "./component/home/home.component";
import {CollectionComponent} from "./component/collection/collection.component";

export const routes: Routes = [
  {path: "", component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'collection', component: CollectionComponent },
];
