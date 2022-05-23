import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GenericsModule } from '@criptoin/shared-ui/generics/generics.module';
import { ExchangeModule } from '@criptoin/shared/exchange/exchange.module';
import { SharedModule } from '@criptoin/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ExchangeModalComponent } from './components/exchange-modal.component';
import { HeaderExchangeModalComponent } from './components/header-exchange-modal.component';
import { ExchangePage } from './containers/exchange.page';
import { ExchangePageRoutingModule } from './exchange-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GenericsModule,
    ExchangeModule,
    SharedModule,
    TranslateModule.forChild(),
    ExchangePageRoutingModule
  ],
  declarations: [
    ExchangePage,
    ExchangeModalComponent,
    HeaderExchangeModalComponent
  ]
})
export class ExchangePageModule {}
