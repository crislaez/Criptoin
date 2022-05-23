import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCoin from '../reducers/coin.reducer';

export const selectorCoinState = createFeatureSelector<fromCoin.State>(
  fromCoin.coinFeatureKey
);

export const selectStatus = createSelector(
  selectorCoinState,
  (state) => state?.status
);

export const selectCoins = createSelector(
  selectorCoinState,
  (state) => state?.coins
);

export const selectPage = createSelector(
  selectorCoinState,
  (state) => state?.page
);

export const selectTotalCountStatus = createSelector(
  selectorCoinState,
  (state) => state?.totalCountStatus
);

export const selectTotalcounts = createSelector(
  selectorCoinState,
  (state) => state?.totalCount
);

export const selectFilters = createSelector(
  selectorCoinState,
  (state) => state?.filter
);

export const selectError = createSelector(
  selectorCoinState,
  (state) => state?.error
);


export const selectCoinStatus = createSelector(
  selectorCoinState,
  (state) => state?.coinStatus
);

export const selectCoin = createSelector(
  selectorCoinState,
  (state) => state?.coin
);

export const selectCoinError = createSelector(
  selectorCoinState,
  (state) => state?.coinError
);
