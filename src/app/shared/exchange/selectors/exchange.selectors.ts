import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromExchange from '../reducers/exchange.reducers';

export const selectorExchangeStatus = createFeatureSelector<fromExchange.State>(
  fromExchange.exchangeFeatureKey
);

export const selectStatus = createSelector(
  selectorExchangeStatus,
  (state) => state?.status
);

export const selectExchanges = createSelector(
  selectorExchangeStatus,
  (state) => state?.exchanges
);

export const selectPage = createSelector(
  selectorExchangeStatus,
  (state) => state?.page
);

export const selectTotalCountStatus = createSelector(
  selectorExchangeStatus,
  (state) => state?.totalCountStatus
);

export const selectTotalcounts = createSelector(
  selectorExchangeStatus,
  (state) => state?.totalCount
);

export const selectFilters = createSelector(
  selectorExchangeStatus,
  (state) => state?.filter
);

export const selectError = createSelector(
  selectorExchangeStatus,
  (state) => state?.error
);

export const selectExchangeStatus = createSelector(
  selectorExchangeStatus,
  (state) => state?.exchangeStatus
);

export const selectExchange = createSelector(
  selectorExchangeStatus,
  (state) => state?.exchange
);

export const selectExchangeError = createSelector(
  selectorExchangeStatus,
  (state) => state?.exchangeError
);
