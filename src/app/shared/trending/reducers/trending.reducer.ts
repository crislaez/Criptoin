
import { EntityStatus } from '@criptoin/shared/utils/models';
import { createReducer, on } from '@ngrx/store';
import * as TrendingActions from '../actions/trending.actions';
import { Trending } from './../models/index';

export const trendingFeatureKey = 'trending';

export interface State {
  status: EntityStatus;
  trending?: Trending[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  trending: [],
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(TrendingActions.loadTrending, (state): State => ({ ...state, error: undefined, status: EntityStatus.Pending })),
  on(TrendingActions.saveTrending, (state, { trending, status, error }): State => ({...state, trending, status, error})),
);
