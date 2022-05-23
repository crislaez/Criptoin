import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Coin } from '@criptoin/shared/coin';
import { errorImage, sliceSmallText } from '@criptoin/shared/utils/helpers/functions';

@Component({
  selector: 'app-coin-card',
  template:`
    <ion-card class="ion-activatable ripple-parent text-color-light" (click)="onOpenModal($event)">
      <div class="ion-card-wrapper displays-between-center">

        <div class="ion-card-left">
          <ion-avatar  slot="start">
            <img [src]="coin?.image" loading="lazy" (error)="errorImage($event)">
          </ion-avatar>

          <div class="ion-card-left__div">
            <div>{{ sliceSmallText(coin?.name) }}</div>
            <div>{{ coin?.market_cap_rank }} {{ coin?.symbol }}</div>
          </div>
        </div>

        <div class="ion-card-center">
          <div class="displays-around-center" [ngStyle]="{'color':getPercentColor(coin?.price_change_percentage_1h_in_currency) ? '#16A671' : 'red' }">
            <div>
              <ng-container *ngIf="getPercentColor(coin?.price_change_percentage_1h_in_currency); else down">
                <ion-icon name="caret-up-outline"></ion-icon>
              </ng-container>
              <ng-template #down>
                <ion-icon name="caret-down-outline"></ion-icon>
              </ng-template>
            </div>
            <div>
              {{ coin?.price_change_percentage_1h_in_currency | number:'1.2-2' }} %
            </div>
          </div>
        </div>

        <div class="ion-card-rigth display-center-align-content-around">
          <div>{{ coin?.current_price | number:'1.2-2' }} $</div>
          <div class="font-small">{{ coin?.market_cap | number:'1.2-2' }} $</div>
        </div>

        <div class="ion-card-end">
          <ion-icon (click)="onPresentPopover($event)" name="ellipsis-vertical-outline"></ion-icon>
        </div>

      </div>
      <!-- RIPPLE EFFECT -->
      <ion-ripple-effect></ion-ripple-effect>
    </ion-card>
  `,
  styleUrls: ['./coin-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoinCardComponent {

  errorImage = errorImage;
  sliceSmallText = sliceSmallText;
  @Input() coin: Coin;
  @Output() presentPopover = new EventEmitter<{ev:any, coin:Coin}>();
  @Output() presentModal = new EventEmitter<{coin:Coin}>();


  constructor() { }


  getPercentColor(percent): boolean {
    return percent >= 0 ? true : false
  }

  onPresentPopover(ev): void{
    ev.stopPropagation();
    this.presentPopover.next({ev, coin: this.coin});
  }

  onOpenModal(ev): void{
    this.presentModal.next({coin: this.coin})
  }

}
