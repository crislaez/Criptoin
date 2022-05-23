
import { EntityStatus } from '@criptoin/shared/utils/models';
import { createReducer, on } from '@ngrx/store';
import * as StorageActions from '../actions/storage.actions';

export const storageFeatureKey = 'storage';

export interface State{
  status?: EntityStatus;
  coins?: string[];
  error?: unknown;
}

const initialState: State = {
  status: EntityStatus.Initial,
  coins:[],
  error: undefined
}


export const reducer = createReducer(
  initialState,
  on(StorageActions.loadCoins, (state) => ({...state, error: undefined, status: EntityStatus.Pending})),
  on(StorageActions.saveCoins, (state, { coins, error, status }) => ({...state, coins, error, status: status })),


  on(
    StorageActions.insertCoin,
    StorageActions.deleteCoin,
    (state) => ({...state, status: EntityStatus.Pending})),
  on(
    StorageActions.insertCoinSuccess,
    StorageActions.deleteCoinSuccess,
    (state ) => ({...state, error: undefined, status: EntityStatus.Loaded })),
  on(
    StorageActions.insertCoinFailure,
    StorageActions.deleteCoinFailure,
    (state, { error }) => ({...state, error, status: EntityStatus.Error })),

);
