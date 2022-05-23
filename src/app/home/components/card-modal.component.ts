import { ChangeDetectionStrategy, Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { Coin, CoinActions, fromCoin } from '@criptoin/shared/coin';
import { fromStorage, StorageActions } from '@criptoin/shared/storage';
import { chartOptions, dateFormat, emptyObject, errorImage, gotToTop, sliceSmallText } from '@criptoin/shared/utils/helpers/functions';
import { IonContent, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import { switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-card-modal',
  template: `
  <!-- HEADER  -->
  <ion-header class="ion-no-border components-background-primary" >
    <ion-toolbar>
      <ion-buttons class="text-color-light" slot="end">
        <ion-button (click)="dismiss()"><ion-icon fill="clear" class="text-color-light" name="close-outline"></ion-icon></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <!-- MAIN  -->
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="header-empty">
    </div>

    <div class="container components-background-primary" >

      <ng-container *ngIf="coinInfo$ | async as coinInfo">
        <ng-container *ngIf="status$ | async as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">
              <ng-container *ngIf="emptyObject(coinInfo); else noData">

                <ion-card class="fade-in-card">

                  <app-header-modal
                    [storageCoins]="(storageCoins$ | async)"
                    [coinInfo]="coinInfo"
                    (addCoin)="addCoin($event)"
                    (removeCoin)="removeCoin($event)">
                  </app-header-modal>

                  <div class="ion-card-chart" *ngIf="chart">
                    <canvas id="canvas" width="400" height="400">{{chart}}</canvas>
                  </div>

                  <div class="displays-around-center days-button-wrapper" *ngIf="chart">
                    <ion-button *ngFor="let coinDays of coinsDaysButtons" (click)="onChangeDays(coinDays?.value)">{{ coinDays?.label | translate}}</ion-button>
                  </div>

                  <!-- ABOUT -->
                  <div>
                    <div class="margin-top-30 mediun-size text-color-light">{{ 'COMMON.ABOUT' | translate }} {{ coinInfo?.name }}</div>
                    <div class="margin-top-10" [innerHTML]="sliceDescription(coinInfo?.description)"></div>
                    <ion-button class="read-moore-button" *ngIf="!readMore" (click)="readMore = true">{{ 'COMMON.READ_MORE'| translate}}</ion-button>
                  </div>

                  <!-- INFO -->
                  <app-asset-information
                    [coinInfo]="coinInfo">
                  </app-asset-information>

                </ion-card>

              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>
      </ng-container>

      <!-- REFRESH -->
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- IS ERROR -->
      <ng-template #serverError>
        <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'35vh'"></app-no-data>
      </ng-template>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'35vh'"></app-no-data>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <app-spinner [top]="'90%'"></app-spinner>
      </ng-template>
    </div>

    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>
  </ion-content>
  `,
  styleUrls: ['./card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardModalComponent {

  gotToTop = gotToTop;
  sliceSmallText = sliceSmallText;
  dateFormat = dateFormat;
  errorImage = errorImage;
  emptyObject = emptyObject;
  @ViewChild(IonContent) content: IonContent;
  @Input() set coin(coin: Coin){
    this.componentStatus = {coin, chartDays:7};
    setTimeout(() => { this.laodCoinInfoTrigger.next(this.componentStatus) },0)
  };
  showButton = false;
  readMore = false;
  coinsDaysButtons = [
    {id:1, label: 'COMMON.SEVEN_DAYS', value: 7},
    {id:2, label: 'COMMON.30_DAYS', value: 30},
    {id:3, label: 'COMMON.ONE_YEAR', value: 365}
  ];

  chart:any = [];

  laodCoinInfoTrigger = new EventEmitter<{coin: Coin, chartDays: number}>();
  componentStatus:{coin: Coin, chartDays: number} = {
    coin: null,
    chartDays: null
  };

  status$ = this.store.select(fromCoin.selectCoinStatus);
  storageCoins$ = this.store.select(fromStorage.selectStorageCoins);

  coinInfo$ = this.laodCoinInfoTrigger.pipe(
    tap(({coin, chartDays}) => this.store.dispatch(CoinActions.loadCoin({coin, chartDays}))),
    switchMap(() =>
      this.store.select(fromCoin.selectCoin).pipe(
        tap(coin => {
          if(emptyObject(coin)){
            setTimeout(() => {
              this.getChartInfo(coin?.marketChart?.prices, coin?.name)
            },0)
          }
        })
      )
    )
    ,tap(coin => {
      if(coin?.description?.length <= 100) this.readMore = true
    })
  );


  constructor(
    private store: Store,
    private modalController: ModalController,
  ) {
    Chart.register(...registerables)
  }


  getChartInfo(marketPrices:any, coinName: string): void{
    const chartData = (marketPrices || [])?.reduce((acc, item) => {
      const [date = null, price = null] = item || [];
      return {
        ...acc,
        date:[...(acc?.date ? acc.date : []), dateFormat(date)],
        price:[...(acc?.price ? acc.price : []), price]
      }
    },{});

    if(emptyObject(this.chart)){
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: chartData?.date,
        datasets: [{
            label: `${coinName} price`,
            data: chartData?.price,
            backgroundColor: '#F1875D',
            borderColor: '#5DACF1',
            pointRadius: 0
        }]
      },
      options: {...chartOptions}
    })
  }

  onChangeDays(days: number): void{
    this.componentStatus = {...this.componentStatus, chartDays:days};
    this.laodCoinInfoTrigger.next(this.componentStatus)
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.componentStatus = {...this.componentStatus, chartDays: 7};
      this.laodCoinInfoTrigger.next(this.componentStatus);
      event.target.complete();
    }, 500);
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // CLOSE MODAL
  dismiss() {
    this.modalController.dismiss({ 'dismissed': true });
  }

  sliceDescription(text: string): string{
    return text?.length > 100 && !this.readMore ? text?.slice(0, 100) + `...` : text
  }


  getPrice(coin){
    return coin?.current_price || coin?.tickers?.[0]?.last
  }

  addCoin(coin: Partial<Coin>): void{
    const { id:coinId = null } = coin || {};
    this.store.dispatch(StorageActions.insertCoin({coinId}))
  }

  removeCoin(coin: Partial<Coin>): void{
    const { id:coinId = null } = coin || {};
    this.store.dispatch(StorageActions.deleteCoin({coinId}));
  }


}

