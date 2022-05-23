import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { OptionMenuComponent } from '@criptoin/shared-ui/generics/components/option-menu.component';
import { CoinActions, Filter, fromCoin } from '@criptoin/shared/coin';
import { fromTrending, TrendingActions } from '@criptoin/shared/trending';
import { gotToTop, trackById } from '@criptoin/shared/utils/helpers/functions';
import { IonContent, ModalController, Platform, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { CardModalComponent } from '../components/card-modal.component';


@Component({
  selector: 'app-home',
  template:`
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header components-background-dark">
      <!-- FORM  -->
      <div class="search-wrapper displays-center">
        <ng-container  *ngIf="!['pending', 'error'].includes((coinStatus$ | async))">
          <form (submit)="searchSubmit($event)">
            <ion-searchbar [placeholder]="'COMMON.BY_NAME' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
          </form>
        </ng-container>
      </div>
    </div>

    <div class="container components-background-primary">

      <ng-container *ngIf="trending$ | async as trending">
        <ng-container *ngIf="trendingStatus$ | async as status">

          <app-swiper
            [trending]="trending"
            [status]="status"
            (openSingleCardModal)="presentModal($event)"
            (presentPopover)="presentPopover($event)">
          </app-swiper>

        </ng-container>
      </ng-container>

      <ng-container *ngIf="coins$ | async as coins">
        <ng-container *ngIf="coinStatus$ | async as coinStatus">
          <ng-container *ngIf="coinStatus !== 'pending' || componentStatus?.page !== 1; else loader">

            <div class="header">
              <h2 class="text-color-light">{{'COMMON.COINS' | translate}}</h2>
            </div>

            <ng-container *ngIf="coinStatus !== 'error'; else serverError">
              <ng-container *ngIf="coins?.length > 0; else noData">

                <ng-container *ngFor="let coin of coins; trackBy: trackById">
                  <app-coin-card
                    [coin]="coin"
                    (presentPopover)="presentPopover($event)"
                    (presentModal)="presentModal($event)">
                  </app-coin-card>
                </ng-container>

                <!-- INFINITE SCROLL  -->
                <app-infinite-scroll
                  [slice]="coins?.length"
                  [status]="coinStatus"
                  [total]="totalCoins$ | async"
                  (loadDataTrigger)="loadData($event)">
                </app-infinite-scroll>

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
        <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'15vh'"></app-no-data>
      </ng-template>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'15vh'"></app-no-data>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <app-spinner [top]="'30%'"></app-spinner>
      </ng-template>
    </div>

    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>
  </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  trackById = trackById;
  gotToTop = gotToTop;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton: boolean = false;
  search = new FormControl('');

  trendingStatus$ = this.store.select(fromTrending.selectStatus);
  trending$ = this.store.select(fromTrending.selectTrending);

  coinStatus$ = this.store.select(fromCoin.selectStatus).pipe(
    shareReplay(1)
  );
  totalCoins$ = this.store.select(fromCoin.selectTotalcounts);

  infiniteScrollTrigger = new EventEmitter<{page:number, filter:Filter}>();
  componentStatus = {
    page: 1,
    filter:{}
  };

  coins$ = this.infiniteScrollTrigger.pipe(
    startWith(this.componentStatus),
    tap(({page, filter}) => {
      this.store.dispatch(CoinActions.loadCoins({page: page?.toString(), filter}))
    }),
    switchMap(() =>
      this.store.select(fromCoin.selectCoins)
    )
  );


  constructor(
    private store: Store,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public platform: Platform,
  ) { }


  // ionViewWillEnter(): void{
  //   this.infiniteScrollTrigger.next(this.componentStatus)
  // }

  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.componentStatus = { ...this.componentStatus, page: 1, filter:{...this.componentStatus.filter, id: this.search.value?.toLowerCase() } };
    this.infiniteScrollTrigger.next(this.componentStatus);
  }

  // CLEAR
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.componentStatus = { ...this.componentStatus, page: 1, filter:{...this.componentStatus.filter, id: '' } };
    this.infiniteScrollTrigger.next(this.componentStatus);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.componentStatus = {page:1, filter:{}};
      this.infiniteScrollTrigger.next(this.componentStatus);
      this.store.dispatch(TrendingActions.loadTrending());
      event.target.complete();
    }, 500);
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    this.componentStatus = {...this.componentStatus, page: this.componentStatus.page + 1};
    this.infiniteScrollTrigger.next(this.componentStatus);
    event.target.complete();
  }

  // SHOW ITEM MENU
  async presentPopover({ev, coin}) {
    ev.stopPropagation();
    const popover = await this.popoverController.create({
      component: OptionMenuComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps:{
        coin,
        from:'home'
      }
    });
    await popover.present();
    const { role, data } = await popover.onDidDismiss();
  }

  // SHOW SINGLE CARD
  async presentModal({coin}) {
    const modal = await this.modalController.create({
      component: CardModalComponent,
      componentProps:{
        coin
      }
    });
    return await modal.present();
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }


}
