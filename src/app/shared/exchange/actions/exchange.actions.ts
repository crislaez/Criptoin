import { EntityStatus } from '@criptoin/shared/utils/models';
import { createAction, props } from '@ngrx/store';
import { Exchange, Filter } from '../models';


export const loadExchanges = createAction(
  '[Exchange] Load Exchanges',
  props<{ page:string, filter?: Filter }>()
);

export const saveExchanges = createAction(
  '[Exchange] Save Exchanges',
  props<{ exchanges: Exchange[], page:string, filter:Filter, error:unknown, status:EntityStatus }>()
);


export const loadExchange = createAction(
  '[Exchange] Load Exchange',
  props<{ exchange: Exchange, chartDays:number }>()
);

export const saveExchange = createAction(
  '[Exchange] Save Exchange',
  props<{ exchange: Partial<Exchange>, error:unknown, status:EntityStatus }>()
);


export const loadTotalExchanges = createAction(
  '[Exchange] Load Total Exchanges'
);

export const saveTotalExchanges = createAction(
  '[Exchange] Save Total Exchanges',
  props<{ totalCount: number, error:unknown,  status:EntityStatus}>()
);
