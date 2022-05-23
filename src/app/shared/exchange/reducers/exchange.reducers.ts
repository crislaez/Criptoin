
import { EntityStatus } from '@criptoin/shared/utils/models';
import { createReducer, on } from '@ngrx/store';
import * as ExchangeActions from '../actions/exchange.actions';
import { Exchange, Filter } from '../models';

export const exchangeFeatureKey = 'exchange';

export interface State {
  status: EntityStatus;
  exchanges?: Exchange[];
  page?: string;
  filter?: Filter;
  error?: unknown;

  totalCountStatus: EntityStatus;
  totalCount?:number;

  exchange?: Partial<Exchange>;
  exchangeStatus: EntityStatus;
  exchangeError?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  exchanges: [],
  page: null,
  filter: null,

  totalCountStatus: EntityStatus.Initial,
  totalCount: 0,

  exchange: {},
  exchangeStatus: EntityStatus.Initial,
  exchangeError: undefined
};

export const reducer = createReducer(
  initialState,
  on(ExchangeActions.loadExchanges, (state): State => ({ ...state, error: undefined, status: EntityStatus.Pending })),
  on(ExchangeActions.saveExchanges, (state, { exchanges, page, filter, status, error }): State => {
    const stateExchanges = page === '1' ? [...exchanges] : [ ...state?.exchanges ? state?.exchanges : [],...exchanges]
    return ({...state, exchanges: stateExchanges, page, status, error, filter})
  }),

  on(ExchangeActions.loadTotalExchanges, (state): State => ({ ...state,  error: undefined, totalCountStatus: EntityStatus.Pending })),
  on(ExchangeActions.saveTotalExchanges, (state, { totalCount, error, status }): State => ({...state, totalCount, error, totalCountStatus: status })),

  on(ExchangeActions.loadExchange, (state): State => ({ ...state,  error: undefined, exchangeStatus: EntityStatus.Pending })),
  on(ExchangeActions.saveExchange, (state, { exchange, error, status }): State => ({...state, exchange, error, exchangeStatus: status })),

);
