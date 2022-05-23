
import { EntityStatus } from '@criptoin/shared/utils/models';
import { createReducer, on } from '@ngrx/store';
import * as CoinActions from '../actions/coin.actions';
import { Coin, Filter } from '../models';

export const coinFeatureKey = 'coin';

export interface State {
  status: EntityStatus;
  coins?: Coin[];
  page?: string;
  filter?: Filter;
  error?: unknown;

  totalCountStatus: EntityStatus;
  totalCount?:number;

  coin?: Partial<Coin>;
  coinStatus: EntityStatus;
  coinError?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  coins: [],
  page: null,
  filter: null,

  totalCountStatus: EntityStatus.Initial,
  totalCount: 0,

  coin: {},
  coinStatus: EntityStatus.Initial,
  coinError: undefined
};

export const reducer = createReducer(
  initialState,
  on(CoinActions.loadCoins, (state): State => ({ ...state, error: undefined, status: EntityStatus.Pending })),
  on(CoinActions.saveCoins, (state, { coins, page, filter, status, error }): State => {
    const stateCoins = page === '1' ? [...coins] : [ ...state?.coins ? state?.coins : [],...coins]
    return ({...state, coins: stateCoins, page, status, error, filter})
  }),

  on(CoinActions.loadTotalCoins, (state): State => ({ ...state,  error: undefined, totalCountStatus: EntityStatus.Pending })),
  on(CoinActions.saveTotalCoins, (state, { totalCount, error, status }): State => ({...state, totalCount, error, totalCountStatus: status })),

  on(CoinActions.loadCoin, (state): State => ({ ...state,  error: undefined, coinStatus: EntityStatus.Pending })),
  on(CoinActions.saveCoin, (state, { coin, error, status }): State => ({...state, coin, error, coinStatus: status })),

);
