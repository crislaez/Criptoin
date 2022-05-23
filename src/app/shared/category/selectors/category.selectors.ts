import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCategory from '../reducers/category.reducer';

export const selectorCategoryState = createFeatureSelector<fromCategory.State>(
  fromCategory.categoryFeatureKey
);

export const selectStatus = createSelector(
  selectorCategoryState,
  (state) => state?.status
);

export const selectCategories = createSelector(
  selectorCategoryState,
  (state) => state?.categories
);

export const selectError = createSelector(
  selectorCategoryState,
  (state) => state?.error
);

