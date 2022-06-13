import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Coin } from '@criptoin/shared/coin';
import { errorImage } from '@criptoin/shared/utils/helpers/functions';

@Component({
  selector: 'app-header-modal',
  template:`
  <div class="ion-card-header displays-around">
    <div class="ion-card-header-avatar">
      <ion-avatar slot="start">
        <img [src]="getImage(coinInfo)" loading="lazy" (error)="errorImage($event)">
      </ion-avatar>
    </div>

    <div class="ion-card-header-title displays-center text-color-light">
    <!-- {{ coinInfo?.symbol }} -->
      <div>{{ coinInfo?.market_cap_rank }} {{ coinInfo?.name }}</div>
    </div>

    <div class="ion-card-header-empty displays-center text-color-light">
      <ng-container *ngIf="storageCoins">
        <div *ngIf="!checkIsInStorageCoin(storageCoins, coinInfo)" (click)="addCoin.next(coinInfo)" class="icon-add">
          <ion-icon name="add-circle-outline"></ion-icon>
        </div>
        <div *ngIf="checkIsInStorageCoin(storageCoins, coinInfo)" (click)="removeCoin.next(coinInfo)" class="icon-remove">
          <ion-icon name="trash-outline"></ion-icon>
        </div>
      </ng-container>
    </div>

    <div class="ion-card-header-down displays-around">
      <div class="displays-around-center">{{ getPrice(coinInfo) | number:'1.2-2' }} $</div>
      <div *ngIf="coinInfo?.price_change_percentage_1h_in_currency as percentage" class="displays-around-center" [ngStyle]="{'color':getPercentColor(percentage) ? '#16A671' : 'red' }">
        <div>
          <ng-container *ngIf="getPercentColor(percentage); else down">
            <ion-icon name="caret-up-outline"></ion-icon>
          </ng-container>

          <ng-template #down>
            <ion-icon name="caret-down-outline"></ion-icon>
          </ng-template>
        </div>
        <div>
          {{ percentage | number:'1.2-2' }} %
        </div>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./header-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderModalComponent {

  errorImage = errorImage;
  @Input() coinInfo: Partial<Coin>;
  @Input() storageCoins: string[];
  @Output() addCoin = new EventEmitter<Partial<Coin>>();
  @Output() removeCoin = new EventEmitter<Partial<Coin>>();

  constructor() { }


  getImage(coin){
    return typeof coin?.image?.small === 'string' ? coin?.image?.small : coin?.image
  }

  checkIsInStorageCoin(storageCoins, coins): boolean{
    const result = (storageCoins || [])?.find((id) => id === coins?.id)
    return result ? true : false
  }

  getPercentColor(percent): boolean {
    return percent >= 0 ? true : false
  }

  getPrice(coin){
    return coin?.current_price || coin?.tickers?.[0]?.last
  }


}
