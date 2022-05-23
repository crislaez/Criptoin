import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { OptionMenuComponent } from '@criptoin/shared-ui/generics/components/option-menu.component';
import { fromStorage, StorageActions } from '@criptoin/shared/storage';
import { gotToTop, trackById } from '@criptoin/shared/utils/helpers/functions';
import { IonContent, ModalController, Platform, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { CardModalComponent } from 'src/app/home/components/card-modal.component';

@Component({
  selector: 'app-saved',
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

      <ng-container *ngIf="(coins$ | async) as coins">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">

              <div class="header" no-border>
                <h2 class="text-color-light">{{'COMMON.SAVED_COINS' | translate}}</h2>
              </div>

              <ng-container *ngIf="coins?.length > 0; else noData">

                <ng-container *ngFor="let coin of coins; trackBy: trackById">
                  <app-coin-card
                    [coin]="coin"
                    (presentPopover)="presentPopover($event)"
                    (presentModal)="presentModal($event)">
                  </app-coin-card>
                </ng-container>

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
        <app-no-data [title]="'COMMON.NOT_SAVED_COINS'" [image]="'assets/images/empty.png'" [top]="'30vh'"></app-no-data>
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
  styleUrls: ['./saved.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedPage {

  trackById = trackById;
  gotToTop = gotToTop;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton: boolean = false;
  search = new FormControl('');

  status$ = this.store.select(fromStorage.selectRechargeStatus).pipe(shareReplay(1));

  infiniteScrollTrigger = new EventEmitter<{reload:boolean, search:string}>();
  componentStatus = { reload:true, search:'' };

  coins$ = this.infiniteScrollTrigger.pipe(
    startWith(this.componentStatus),
    switchMap(({reload, search}) =>
      this.store.select(fromStorage.selectStorageCoins).pipe(
        tap((coinsId = []) => {
          if(!search && !!reload) this.store.dispatch(StorageActions.rechargeLoadCoins({coinsId}))
        }),
        switchMap((coinsId) =>
          this.store.select(fromStorage.selecRechargeCoins).pipe(
            map(rechargeCoins => {
              const allCoins = search
                            ? (rechargeCoins || [])?.filter(({name}) => name?.toLocaleLowerCase() === search?.toLocaleLowerCase() || name?.toLocaleLowerCase()?.includes(search.toLocaleLowerCase()))
                            : rechargeCoins;

              return allCoins
            })
          )
        )
      )
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
    this.componentStatus = { reload:true, search: this.search.value };
    this.infiniteScrollTrigger.next(this.componentStatus);
  }

  // CLEAR
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.componentStatus = { reload:false, search: '' };
    this.infiniteScrollTrigger.next(this.componentStatus);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.componentStatus = {reload:true, search:''};
      this.infiniteScrollTrigger.next(this.componentStatus);
      event.target.complete();
    }, 500);
  }

  // SHOW ITEM MENU
  async presentPopover({ev, coin}) {
    const popover = await this.popoverController.create({
      component: OptionMenuComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps:{
        coin,
        from:'saved'
      }
    });
    await popover.present();
    const { role, data } = await popover.onDidDismiss();
    if(!!data){
      this.search.reset();
      this.componentStatus = { reload:true, search: '' };
      this.infiniteScrollTrigger.next(this.componentStatus);
    }
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
