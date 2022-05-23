import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NotificationModule } from '../notification/notification.module';
import { TrendingEffects } from './effects/trending.effects';
import * as fromTrending from './reducers/trending.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromTrending.trendingFeatureKey, fromTrending.reducer),
    EffectsModule.forFeature([TrendingEffects]),
  ]
})
export class TrendingModule { }
