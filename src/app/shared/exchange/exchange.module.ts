import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationModule } from '../notification/notification.module';
import { ExchangeEffects } from './effects/exchange.effects';
import * as fromExchange from './reducers/exchange.reducers';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromExchange.exchangeFeatureKey, fromExchange.reducer),
    EffectsModule.forFeature([ExchangeEffects]),
  ]
})
export class ExchangeModule { }
