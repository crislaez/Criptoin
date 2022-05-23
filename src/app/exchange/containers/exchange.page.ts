import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { OptionMenuComponent } from '@criptoin/shared-ui/generics/components/option-menu.component';
import { ExchangeActions, Filter, fromExchange } from '@criptoin/shared/exchange';
import { gotToTop, trackById } from '@criptoin/shared/utils/helpers/functions';
import { IonContent, ModalController, Platform, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { ExchangeModalComponent } from '../components/exchange-modal.component';

@Component({
  selector: 'app-exchange',
  template:`
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header components-background-dark">
      <!-- FORM  -->
      <div class="search-wrapper displays-center">
        <ng-container  *ngIf="!['pending', 'error'].includes((status$ | async))">
          <form (submit)="searchSubmit($event)">
            <ion-searchbar [placeholder]="'COMMON.BY_NAME' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
          </form>
        </ng-container>
      </div>
    </div>

    <div class="container components-background-primary">

      <ng-container *ngIf="(exchanges$ | async) as exchanges">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending' || componentStatus?.page !== 1; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">

              <div class="header" no-border>
                <h2 class="text-color-light">{{'COMMON.EXCHANGES' | translate}}</h2>
              </div>

              <ng-container *ngIf="exchanges?.length > 0; else noData">

                <ng-container *ngFor="let exchange of exchanges; trackBy: trackById">
                  <app-exchange-card
                    [exchange]="exchange"
                    (presentPopover)="presentPopover($event)"
                    (presentModal)="presentModal($event)">
                  </app-exchange-card>
                </ng-container>

                <!-- INFINITE SCROLL  -->
                <app-infinite-scroll
                  [slice]="exchanges?.length"
                  [status]="status"
                  [total]="totalExchanges$ | async"
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
        <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'30vh'"></app-no-data>
      </ng-template>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'30vh'"></app-no-data>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <app-spinner [top]="'80%'"></app-spinner>
      </ng-template>
    </div>

    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>
  </ion-content>
  `,
  styleUrls: ['./exchange.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangePage {

  trackById = trackById;
  gotToTop = gotToTop;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton: boolean = false;
  search = new FormControl('');

  status$ = this.store.select(fromExchange.selectStatus).pipe(
    shareReplay(1)
  );
  totalExchanges$ = this.store.select(fromExchange.selectTotalcounts);

  infiniteScrollTrigger = new EventEmitter<{page:number, filter: Filter}>();
  componentStatus = {
    page: 1,
    filter:{}
  };

  exchanges$ = this.infiniteScrollTrigger.pipe(
    startWith(this.componentStatus),
    tap(({page, filter}) => {
      this.store.dispatch(ExchangeActions.loadExchanges({page: page?.toString(), filter}));
    }),
    switchMap(() =>
      this.store.select(fromExchange.selectExchanges)
    )
    // ,tap(d => console.log(d))
  );


  constructor(
    private store: Store,
    public platform: Platform,
    public modalController: ModalController,
    public popoverController: PopoverController
  ) { }


  // ionViewWillEnter(): void{
  //   this.infiniteScrollTrigger.next(this.componentStatus)
  // }

  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    // this.componentStatus = { ...this.componentStatus, page: 1, filter:{...this.componentStatus.filter, id: this.search.value?.toLowerCase() } };
    // this.infiniteScrollTrigger.next(this.componentStatus);
  }

  // CLEAR
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    // this.componentStatus = { ...this.componentStatus, page: 1, filter:{...this.componentStatus.filter, id: '' } };
    // this.infiniteScrollTrigger.next(this.componentStatus);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.componentStatus = {page: 1, filter:{}};
      this.infiniteScrollTrigger.next(this.componentStatus);
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
  async presentPopover({ev, exchange:coin}) {
    ev.stopPropagation();
    const popover = await this.popoverController.create({
      component: OptionMenuComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps:{
        coin,
        from:'exchange'
      }
    });
    await popover.present();
    const { role, data } = await popover.onDidDismiss();
  }

  // SHOW SINGLE CARD
  async presentModal({exchange}) {
    const modal = await this.modalController.create({
      component: ExchangeModalComponent,
      componentProps:{
        exchange
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
