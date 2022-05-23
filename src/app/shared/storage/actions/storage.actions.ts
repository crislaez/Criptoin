
import { Coin } from '@criptoin/shared/coin';
import { EntityStatus } from '@criptoin/shared/utils/models';
import { createAction, props } from '@ngrx/store';


export const loadCoins = createAction(
  '[Storage] Load Coins'
);

export const saveCoins = createAction(
  '[Storage] Save Coins',
   props<{coins: string[], error: unknown, status: EntityStatus}>()
);



export const insertCoin = createAction(
  '[Storage] Insert Coin',
  props<{coinId: string}>()
);

export const insertCoinSuccess = createAction(
  '[Storage] Insert Coin Success',
);

export const insertCoinFailure = createAction(
  '[Storage] Insert Coin Failure',
   props<{error: unknown}>()
);



export const deleteCoin = createAction(
  '[Storage] Delete Coin',
  props<{coinId: string}>()
);

export const deleteCoinSuccess = createAction(
  '[Storage] Delete Coin Success',
);

export const deleteCoinFailure = createAction(
  '[Storage] Delete Coin Failure',
   props<{error: unknown}>()
);



export const rechargeLoadCoins = createAction(
  '[Storage] Recharge Load Coins',
  props<{coinsId: string[]}>()
);

export const saveRechargeLoadCoins = createAction(
  '[Storage] Save Recharge Load Coins',
   props<{coins: Coin[], error: unknown, status: EntityStatus}>()
);
