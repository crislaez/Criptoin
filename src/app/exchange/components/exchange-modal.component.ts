import { ChangeDetectionStrategy, Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { Exchange, ExchangeActions, fromExchange } from '@criptoin/shared/exchange';
import { chartOptions, dateFormat, emptyObject, gotToTop, sliceSmallText } from '@criptoin/shared/utils/helpers/functions';
import { IonContent, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-exchange-modal',
  template:`
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

      <ng-container *ngIf="exchangeInfo$ | async as exchangeInfo">
        <ng-container *ngIf="status$ | async as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">
              <ng-container *ngIf="emptyObject(exchangeInfo); else noData">

                <ion-card class="fade-in-card">
                  <app-header-exchange-modal
                    [exchangeInfo]="exchangeInfo">
                  </app-header-exchange-modal>

                  <div class="ion-card-chart" *ngIf="chart">
                    <canvas id="canvas" width="400" height="400">{{chart}}</canvas>
                  </div>

                  <div class="displays-around-center days-button-wrapper" *ngIf="chart">
                    <ion-button *ngFor="let coinDays of coinsDaysButtons" (click)="onChangeDays(coinDays?.value)">{{ coinDays?.label | translate}}</ion-button>
                  </div>

                  <!-- INFO -->
                  <div>
                    <div class="margin-top-30 mediun-size text-color-light">{{ 'COMMON.LINKS' | translate }}</div>
                    <div class="displays-between margin-top-10">
                      <ng-container *ngFor="let url of exchangesLinks">
                        <div class="width-25 margin-top-10">{{ url?.label | translate }}</div>
                        <div *ngIf="exchangeInfo?.[url?.filed] as field" class="width-70 margin-top-10"><a [href]="field">{{ field }}</a></div>
                        <div *ngIf="!exchangeInfo?.[url?.filed] as field" class="width-70 margin-top-10"> - </div>
                      </ng-container>
                    </div>
                  </div>

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
  styleUrls: ['./exchange-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeModalComponent {

  gotToTop = gotToTop;
  dateFormat = dateFormat;
  sliceSmallText = sliceSmallText;
  emptyObject = emptyObject;
  @ViewChild(IonContent) content: IonContent;
  @Input() set exchange(exchange: Exchange){
    this.componentStatus = {exchange, chartDays:7};
    setTimeout(() => { this.laodExchangeInfoTrigger.next(this.componentStatus) },0)
  };

  showButton = false;
  coinsDaysButtons = [
    {id:1, label: 'COMMON.SEVEN_DAYS', value: 7},
    {id:2, label: 'COMMON.30_DAYS', value: 30},
    {id:3, label: 'COMMON.ONE_YEAR', value: 365}
  ];

  exchangesLinks = [
    {id:1, label:'COMMON.WEB', filed:'url'},
    {id:2, label:'COMMON.REDDIT', filed:'reddit_url'},
    {id:3, label:'COMMON.FACEBOOK', filed:'facebook_url'},
    {id:4, label:'COMMON.SLACK', filed:'slack_url'},
    {id:5, label:'COMMON.TELEGRAM', filed:'telegram_url'},
    {id:6, label:'COMMON.OTHER', filed:'other_url_1'},
    {id:7, label:'', filed:'other_url_2'}
  ];

  chart:any = [];
  status$ = this.store.select(fromExchange.selectExchangeStatus);

  laodExchangeInfoTrigger = new EventEmitter<{exchange: Exchange, chartDays:number}>();
  componentStatus = {
    exchange: null,
    chartDays: null
  };

  exchangeInfo$ = this.laodExchangeInfoTrigger.pipe(
    tap(({exchange, chartDays}) => this.store.dispatch(ExchangeActions.loadExchange({exchange, chartDays}))),
    switchMap(() =>
      this.store.select(fromExchange.selectExchange).pipe(
        tap(exchange => {
          if(emptyObject(exchange)){
            setTimeout(() => {
              this.getChartInfo(exchange?.marketChart, exchange?.name)
            },0)
          }
        })
      )
    )
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

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.componentStatus = {...this.componentStatus, chartDays: 7};
      this.laodExchangeInfoTrigger.next(this.componentStatus);
      event.target.complete();
    }, 500);
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  onChangeDays(chartDays: number): void{
    this.componentStatus = {...this.componentStatus, chartDays},
    this.laodExchangeInfoTrigger.next(this.componentStatus)
  }

  // CLOSE MODAL
  dismiss() {
    this.modalController.dismiss({ 'dismissed': true });
  }


}
