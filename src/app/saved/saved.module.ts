import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenericsModule } from '@criptoin/shared-ui/generics/generics.module';
import { CoinModule } from '@criptoin/shared/coin/coin.module';
import { SharedModule } from '@criptoin/shared/shared/shared.module';
import { StorageModule } from '@criptoin/shared/storage/storage.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SavedPage } from './containers/saved.page';
import { SavedPageRoutingModule } from './saved-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoinModule,
    SharedModule,
    GenericsModule,
    StorageModule,
    TranslateModule.forChild(),
    SavedPageRoutingModule
  ],
  declarations: [
    SavedPage
  ]
})
export class SavedPageModule {}
