
import { EntityStatus } from '@criptoin/shared/utils/models';
import { createAction, props } from '@ngrx/store';
import { Category } from '../models';


export const loadCategories = createAction(
  '[Category] Load Categorires',
);

export const saveCategories  = createAction(
  '[Category] Save Categorires',
  props<{ categories: Category[], error:unknown, status:EntityStatus }>()
);

