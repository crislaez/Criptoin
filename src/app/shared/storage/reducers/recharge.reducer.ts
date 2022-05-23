
import { Coin } from '@criptoin/shared/coin';
import { EntityStatus } from '@criptoin/shared/utils/models';
import { createReducer, on } from '@ngrx/store';
import * as StorageActions from '../actions/storage.actions';

export const rechargeFeatureKey = 'recharge';

export interface State{
  status?: EntityStatus;
  coins?: Coin[];
  error?: unknown;
}

const initialState: State = {
  status: EntityStatus.Initial,
  coins:[],
  error: undefined
}


export const reducer = createReducer(
  initialState,
  on(StorageActions.rechargeLoadCoins, (state) => ({...state, error: undefined, status: EntityStatus.Pending})),
  on(StorageActions.saveRechargeLoadCoins, (state, { coins, error, status }) => ({...state, coins, error, status: status })),

);
