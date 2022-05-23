import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTrending from '../reducers/trending.reducer';

export const selectorTrendingState = createFeatureSelector<fromTrending.State>(
  fromTrending.trendingFeatureKey
);

export const selectStatus = createSelector(
  selectorTrendingState,
  (state) => state?.status
);

export const selectTrending = createSelector(
  selectorTrendingState,
  (state) => state?.trending
);

export const selectError = createSelector(
  selectorTrendingState,
  (state) => state?.error
);

