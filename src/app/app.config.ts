import {ApplicationConfig, isDevMode} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {provideStore} from "@ngrx/store";
import {userReducer} from "./store/user/user.reducer";
import {provideEffects} from "@ngrx/effects";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {UserEffects} from "./store/user/user.effects";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient(),
    provideStore({user: userReducer }),
    provideEffects([UserEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
