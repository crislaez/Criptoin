// import { createFeatureSelector, createSelector } from '@ngrx/store';
// import * as fromStorage from '../reducers/storage.reducer';

// export const selectStorageState = createFeatureSelector<fromStorage.State>(
//   fromStorage.storageFeatureKey
// );


// export const selecCoins = createSelector(
//   selectStorageState,
//   (state) => state.coins
// );

// export const selectStatus = createSelector(
//   selectStorageState,
//   (state) => state.status
// );

// export const selectErrors = createSelector(
//   selectStorageState,
//   (state) => state.error
// );
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { combineFeatureKey, CombineState } from '../reducers';
import { storageFeatureKey } from '../reducers/storage.reducer';
import { rechargeFeatureKey } from '../reducers/recharge.reducer';

export const selectCombineState = createFeatureSelector<CombineState>(combineFeatureKey);

/* === STORAGE === */
export const selectStorageState = createSelector(
  selectCombineState,
  (state) => state[storageFeatureKey]
);

export const selectStorageStatus = createSelector(
  selectStorageState,
  (state) => state?.status
);

export const selectStorageCoins = createSelector(
  selectStorageState,
  (state) => state.coins
);


export const selectStorageErrors = createSelector(
  selectStorageState,
  (state) => state.error
);



/* === RECHARGE === */
export const selectRechargeState = createSelector(
  selectCombineState,
  (state) => state[rechargeFeatureKey]
);

export const selectRechargeStatus = createSelector(
  selectRechargeState,
  (state) => state?.status
);

export const selecRechargeCoins = createSelector(
  selectRechargeState,
  (state) => state.coins
);


export const selectRechargeErrors = createSelector(
  selectRechargeState,
  (state) => state.error
);

