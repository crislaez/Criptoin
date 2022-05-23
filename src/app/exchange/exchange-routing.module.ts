import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangePage } from './containers/exchange.page';


const routes: Routes = [
  {
    path: '',
    component: ExchangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangePageRoutingModule {}
