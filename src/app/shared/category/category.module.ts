import { CategoryEffects } from './effects/category.effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationModule } from '../notification/notification.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCategory from './reducers/category.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromCategory.categoryFeatureKey, fromCategory.reducer),
    EffectsModule.forFeature([CategoryEffects]),
  ]
})
export class CategoryModule { }
