import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import {User} from "../../services/collection/collection.service";


export interface UserState {
  user: User | null;
  loading: boolean;
  error: any | null;
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUser, (state) => ({ ...state, loading: true })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(UserActions.loadUserFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(UserActions.updateUser, (state) => ({ ...state, loading: true })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(UserActions.updateUserFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(UserActions.deleteUser, (state) => ({ ...state, loading: true })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({ ...state, user: null, loading: false })),
  on(UserActions.deleteUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.updateUserPoints, (state, { points, montant }) => ({
  ...state,
  user: {
    ...state.user!,
    points,
    montant
  },
}))
);
