
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Trending } from '@criptoin/shared/trending';
import { errorImage, getSliderConfig, sliceText, trackById } from '@criptoin/shared/utils/helpers/functions';
import { EntityStatus } from '@criptoin/shared/utils/models';
import SwiperCore, { Navigation, Pagination } from 'swiper';

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-swiper',
  template:`
  <div class="header" no-border>
    <h2 class="text-color-light">{{'COMMON.TRENDING' | translate}}</h2>
  </div>

  <ng-container *ngIf="status === 'loaded'">
    <ng-container *ngIf="trending?.length > 0; else noData">
      <swiper #swiper effect="fade" [config]="getSliderConfig(trending)" >
        <ng-template swiperSlide *ngFor="let item of trending; trackBy: trackById" >
          <ion-card class="ion-activatable ripple-parent slide-ion-card" (click)="openSingleCardModal.next({coin: item})" >
            <ion-img class="ion-card-image" [src]="item?.large" loading="lazy" (ionError)="errorImage($event)"></ion-img>

            <ion-card-header class="font-medium">
              <div class="displays-around-center">
                <div class="ion-card-header-left">
                  <div >{{ item?.market_cap_rank }} <span class="text-color-light">{{ sliceText(item?.name) }}</span></div>
                </div>

                <div class="ion-card-header-rigth">
                  <ion-icon class="text-color-light" (click)="presentPopover.next({ev: $event, coin: item})" name="ellipsis-vertical-outline"></ion-icon>
                </div>
              </div>
            </ion-card-header>

            <!-- RIPLE EFFECT  -->
            <ion-ripple-effect></ion-ripple-effect>
          </ion-card>
        </ng-template>
      </swiper>
    </ng-container>
  </ng-container>

  <ng-container *ngIf="status === 'pending'">
    <swiper #swiper effect="fade" [config]="getSliderConfig([0,1])">
      <ng-template swiperSlide *ngFor="let item of [0,2]">
        <ion-card class="ion-activatable ripple-parent slide-ion-card"  >
          <ion-img >
            <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
          </ion-img>
          <ion-card-header class="font-medium text-color-light">
            <ion-skeleton-text animated ></ion-skeleton-text>
          </ion-card-header>
        </ion-card>
      </ng-template>
    </swiper>
  </ng-container>

  <!-- IS ERROR -->
  <ng-container *ngIf="status === 'error'">
    <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'15vh'"></app-no-data>
  </ng-container>

  <!-- IS NO DATA  -->
  <ng-template #noData>
    <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'15vh'"></app-no-data>
  </ng-template>
  `,
  styleUrls: ['./swiper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwiperComponent {

  getSliderConfig = getSliderConfig;
  sliceText = sliceText;
  trackById = trackById;
  errorImage = errorImage;

  @Input() trending: Trending[];
  @Input() status: EntityStatus;
  @Output() openSingleCardModal = new EventEmitter<{coin: any}>()
  @Output() presentPopover = new EventEmitter<{ev,coin: any}>();


  constructor() { }


}
