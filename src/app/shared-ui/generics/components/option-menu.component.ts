
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Share } from '@capacitor/share';
import { Coin } from '@criptoin/shared/coin';
import { Exchange } from '@criptoin/shared/exchange';
import { StorageActions } from '@criptoin/shared/storage';
import { NavParams, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-option-menu',
  template: `
    <ion-list lines="none" class="text-color-dark">
      <ion-item detail *ngIf="!['saved','exchange']?.includes(from)" (click)="saveItem()">{{ 'COMMON.SAVE' | translate }}</ion-item>
      <ion-item detail *ngIf="!['home','exchange']?.includes(from)" (click)="deleteItem()">{{ 'COMMON.DELETE' | translate }}</ion-item>
      <ion-item detail button (click)="sharedContent()">{{ 'COMMON.SHARE' | translate }}</ion-item>
      <ion-item detail="false" (click)="close(false)">{{ 'COMMON.CLOSE' | translate }}</ion-item>
    </ion-list>
  `,
  styleUrls: ['./option-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionMenuComponent {

  coin: Coin | Exchange;
  from: string;


  constructor(
    public popoverController: PopoverController,
    private navParams: NavParams,
    private store: Store
  ) {
    this.coin = this.navParams.get('coin');
    this.from = this.navParams.get('from');
  }


  deleteItem(): void{
    const { id:coinId = null } = this.coin || {};
    this.store.dispatch(StorageActions.deleteCoin({coinId}));
    this.close(true);
  }

  saveItem(): void{
    const { id:coinId = null } = this.coin || {};
    this.store.dispatch(StorageActions.insertCoin({coinId}))
    this.close(true);
  }

  close(boo:boolean): void{
    this.popoverController.dismiss(boo)
  }

  async sharedContent(){
    const text = this.from !== 'exchange' ? 'Criptoin: cripto currency' : 'Criptoin: exchange';
    const link = this.from !== 'exchange' ? 'monedas' : 'intercambios';

    await Share.share({
      title: this.coin?.name,
      text: this.coin?.name,
      url: `https://www.coingecko.com/es/${link}/${this.coin?.id}`,
      dialogTitle: `${text}: ${this.coin?.name}`,
    });

    this.popoverController.dismiss(false)
  }


}
