import { combineReducers } from "@ngrx/store";
import * as fromStorage from "./storage.reducer";
import * as fromRecharge from "./recharge.reducer";

export const combineFeatureKey = 'storage';

export interface CombineState {
  [fromStorage.storageFeatureKey]: fromStorage.State;
  [fromRecharge.rechargeFeatureKey]: fromRecharge.State;
};

export const reducer = combineReducers({
  [fromStorage.storageFeatureKey]: fromStorage.reducer,
  [fromRecharge.rechargeFeatureKey]: fromRecharge.reducer
});
