import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenericsModule } from '@criptoin/shared-ui/generics/generics.module';
import { CoinModule } from '@criptoin/shared/coin/coin.module';
import { SharedModule } from '@criptoin/shared/shared/shared.module';
import { StorageModule } from '@criptoin/shared/storage/storage.module';
import { TrendingModule } from '@criptoin/shared/trending/trending.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AssetInformationComponent } from './components/asset-information.component';
import { CardModalComponent } from './components/card-modal.component';
import { HeaderModalComponent } from './components/header-modal.component';
import { HomePage } from './containers/home.page';
import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenericsModule,
    CoinModule,
    SharedModule,
    StorageModule,
    TrendingModule,
    TranslateModule.forChild(),
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    CardModalComponent,
    HeaderModalComponent,
    AssetInformationComponent,
  ]
})
export class HomePageModule {}
