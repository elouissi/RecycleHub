import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(() =>
        this.authService.getCurrentUser().pipe(
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((error) => of(UserActions.loadUserFailure({ error })))
        )
      )
    )
  );


  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ user }) =>
        this.authService.updateUser(user).pipe(
          map((updatedUser) => UserActions.updateUserSuccess({ user: updatedUser })),
          catchError((error) => of(UserActions.updateUserFailure({ error })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ id }) =>
        this.authService.deleteUser(id).pipe(
          map(() => UserActions.deleteUserSuccess({ id })),
          catchError((error) => of(UserActions.deleteUserFailure({ error })))
        )
      )
    )
  );
}
