import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationModule } from '../notification/notification.module';
import { CoinEffects } from './effects/coin.effects';
import * as fromCoin from './reducers/coin.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromCoin.coinFeatureKey, fromCoin.reducer),
    EffectsModule.forFeature([CoinEffects]),
  ]
})
export class CoinModule { }
