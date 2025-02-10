import { createAction, props } from '@ngrx/store';
import {User} from "../../services/collection/collection.service";

export const loadUser = createAction('[User] Load User');
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: User }>());
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: any }>());

export const updateUser = createAction('[User] Update User', props<{ user: User }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: User }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: any }>());

export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction('[User] Delete User Success', props<{ id: string }>());
export const deleteUserFailure = createAction('[User] Delete User Failure', props<{ error: any }>());

export const updateUserPoints = createAction(
  '[User] Update Points',
  props<{ points: number; montant: number }>()
);
