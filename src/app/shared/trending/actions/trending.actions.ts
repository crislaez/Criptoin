
import { EntityStatus } from '@criptoin/shared/utils/models';
import { createAction, props } from '@ngrx/store';
import { Trending } from './../models/index';


export const loadTrending = createAction(
  '[Trending] Load Trending'
);

export const saveTrending = createAction(
  '[Trending] Save Trending',
  props<{ trending: Trending[], error:unknown, status:EntityStatus }>()
);
