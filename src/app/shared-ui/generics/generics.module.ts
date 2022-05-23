import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StorageModule } from '@criptoin/shared/storage/storage.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'swiper/angular';
import { CoinCardComponent } from './components/coin-card.component';
import { ExchangeCardComponent } from './components/exchange-card.component';
import { InfiniteScrollComponent } from './components/infinite-scroll.component';
import { NoDataComponent } from './components/no-data.component';
import { OptionMenuComponent } from './components/option-menu.component';
import { SpinnerComponent } from './components/spinner.component';
import { SwiperComponent } from './components/swiper.component';

const COMPONENTS = [
  InfiniteScrollComponent,
  NoDataComponent,
  SpinnerComponent,
  SwiperComponent,
  CoinCardComponent,
  OptionMenuComponent,
  ExchangeCardComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    RouterModule,
    StorageModule,
    TranslateModule.forChild()
  ],
  exports:[
    ...COMPONENTS
  ]
})
export class GenericsModule { }
