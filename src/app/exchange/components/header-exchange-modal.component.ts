import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Exchange } from '@criptoin/shared/exchange';
import { errorImage } from '@criptoin/shared/utils/helpers/functions';

@Component({
  selector: 'app-header-exchange-modal',
  template:`
    <div class="ion-card-header displays-around">
      <div class="ion-card-header-avatar">
        <ion-avatar slot="start">
          <img [src]="exchangeInfo?.image" loading="lazy" (error)="errorImage($event)">
        </ion-avatar>
      </div>

      <div class="ion-card-header-title displays-start text-color-light">
        <div>{{ exchangeInfo?.trust_score_rank }} {{ exchangeInfo?.name }}</div>
      </div>


      <div class="ion-card-header-down displays-around">
        <div class="displays-around-center">{{ 'COMMON.TRADE_VOLUME_24' | translate }} {{ exchangeInfo?.trade_volume_24h_btc | number:'1.2-2' }} $</div>
      </div>
    </div>
  `,
  styleUrls: ['./header-exchange-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderExchangeModalComponent {

  errorImage = errorImage;
  @Input() exchangeInfo: Partial<Exchange>;


  constructor() { }


}
