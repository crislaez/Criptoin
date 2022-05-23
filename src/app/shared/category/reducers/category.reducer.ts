
import { EntityStatus } from '@criptoin/shared/utils/models';
import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from '../actions/category.actions';
import { Category } from '../models';

export const categoryFeatureKey = 'category';

export interface State {
  status: EntityStatus;
  categories?: Category[];
  error?: unknown;
}

export const initialState: State = {
  status: EntityStatus.Initial,
  categories: null,
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(CategoryActions.loadCategories, (state): State => ({ ...state, error: undefined, status: EntityStatus.Pending })),
  on(CategoryActions.saveCategories, (state, { categories, status, error }): State => ({...state, categories, status, error})),

);
