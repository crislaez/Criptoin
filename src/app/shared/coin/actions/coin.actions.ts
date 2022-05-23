import { EntityStatus } from '@criptoin/shared/utils/models';
import { createAction, props } from '@ngrx/store';
import { Coin, Filter } from '../models';


export const loadCoins = createAction(
  '[Coin] Load Coins',
  props<{ page:string, filter?: Filter }>()
);

export const saveCoins = createAction(
  '[Coin] Save Coins',
  props<{ coins: Coin[], page:string, filter:Filter, error:unknown, status:EntityStatus }>()
);


export const loadCoin = createAction(
  '[Coin] Load Coin',
  props<{ coin: Coin, chartDays:number }>()
);

export const saveCoin = createAction(
  '[Coin] Save Coin',
  props<{ coin: Partial<Coin>, error:unknown, status:EntityStatus }>()
);


export const loadTotalCoins = createAction(
  '[Coin] Load Total Coins'
);

export const saveTotalCoins = createAction(
  '[Coin] Save Total Coins',
  props<{ totalCount: number, error:unknown,  status:EntityStatus}>()
);
