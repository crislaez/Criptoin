import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Exchange } from '@criptoin/shared/exchange';
import { errorImage, sliceText } from '@criptoin/shared/utils/helpers/functions';

@Component({
  selector: 'app-exchange-card',
  template:`
    <ion-card class="ion-activatable ripple-parent text-color-light" (click)="onOpenModal($event)">
      <div class="ion-card-wrapper displays-between-center">

        <div class="ion-card-left">
          <ion-avatar  slot="start">
            <img [src]="exchange?.image" loading="lazy" (error)="errorImage($event)">
          </ion-avatar>

          <div class="ion-card-left__div">
            <div>{{ sliceText(exchange?.name, 17) }}</div>
            <div>{{ exchange?.trust_score_rank }}</div>
          </div>
        </div>

        <div class="ion-card-center displays-start">
          <div>
            {{ exchange?.country }}
          </div>
        </div>

        <div class="ion-card-rigth display-center-align-content-around">
          <div>{{ exchange?.trade_volume_24h_btc | number:'1.2-2' }} $</div>
          <!-- <div class="font-small">{{ coin?.market_cap | number:'1.2-2' }} $</div> -->
        </div>

        <div class="ion-card-end">
          <ion-icon (click)="onPresentPopover($event)" name="ellipsis-vertical-outline"></ion-icon>
        </div>

      </div>
      <!-- RIPPLE EFFECT -->
      <ion-ripple-effect></ion-ripple-effect>
    </ion-card>
  `,
  styleUrls: ['./exchange-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeCardComponent {

  errorImage = errorImage;
  sliceText = sliceText;
  @Input() exchange: Exchange;
  @Output() presentPopover = new EventEmitter<{ev, exchange: Exchange}>();
  @Output() presentModal = new EventEmitter<{exchange:Exchange}>();


  constructor() { }


  onPresentPopover(ev): void{
    ev.stopPropagation();
    this.presentPopover.next({ev, exchange: this.exchange});
  }

  onOpenModal(ev): void{
    this.presentModal.next({exchange: this.exchange})
  }

}
