import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Coin } from '@criptoin/shared/coin';
import { trackById, sliceText } from '@criptoin/shared/utils/helpers/functions';

@Component({
  selector: 'app-asset-information',
  template:`
    <div>
      <div class="margin-top-30 mediun-size text-color-light">{{ 'COMMON.LINKS' | translate }}</div>

      <div *ngFor="let item of coinInfoLinks; trackBy: trackById" class="displays-between margin-top-10">
        <div class="width-25">{{ item?.label | translate }}:</div>

        <ng-container *ngIf="coinInfo?.links?.[item?.field]; else noInfo">
          <div *ngIf="item?.field !== 'subreddit_url'" class="width-70">
            <ng-container *ngFor="let link of filterLinks(coinInfo?.links?.[item?.field])">
              <a [href]="link">{{ sliceText(link, 35) }}</a>
              <br>
            </ng-container>
          </div>
          <div *ngIf="item?.field === 'subreddit_url'" class="width-70"><a [href]="coinInfo?.links?.[item?.field]">{{ sliceText(coinInfo?.links?.[item?.field], 35) }}</a></div>
        </ng-container>
      </div>

      <div class="margin-top-30 mediun-size text-color-light">{{ 'COMMON.ASSET_INFORMATION' | translate }}</div>

      <div *ngFor="let item of coinInfoFiels; trackBy: trackById" class="displays-between margin-top-10">
        <div>{{ item?.label | translate }}:</div>
        <ng-container *ngIf="coinInfo?.[item?.field]; else noInfo">
          <div *ngIf="item?.field === 'last_updated'">{{ coinInfo?.[item?.field] | date: 'MMMM d, y, h:mm a'}}</div>
          <div *ngIf="item?.field !== 'last_updated'">{{ coinInfo?.[item?.field] | number:'1.2-2'}} <span *ngIf="!['total_volume','total_supply']?.includes(item?.field)">$</span></div>
        </ng-container>
      </div>

      <ng-template #noInfo>
        <div> - </div>
      </ng-template>

    </div>
  `,
  styleUrls: ['./asset-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetInformationComponent {

  trackById = trackById;
  sliceText = sliceText;
  @Input() coinInfo: Partial<Coin>;

  coinInfoLinks = [
    {id:1, label:'COMMON.HOME_PAGE', field:'homepage'},
    {id:2, label:'COMMON.OFFICIAL_FORUM', field:'official_forum_url'},
    {id:3, label:'COMMON.SUBREDDIT', field:'subreddit_url'},
    {id:4, label:'COMMON.BLOCKCHAIN_SITE', field:'blockchain_site'},
  ];

  coinInfoFiels = [
    {id:1, label:'COMMON.LAST_UPDATE', field:'last_updated'},
    {id:2, label:'COMMON.MARKET_CAP', field:'market_cap'},
    {id:3, label:'COMMON.MARKET_CAP_CHANGE_24', field:'market_cap_change_24h'},
    {id:4, label:'COMMON.HIGH_PRICE_24', field:'high_24h'},
    {id:5, label:'COMMON.LOWER_PRICE_24', field:'low_24h'},
    {id:6, label:'COMMON.PRICE_CHANGE_24', field:'price_change_24h'},
    {id:7, label:'COMMON.TOTAL_VOLUMEN', field:'total_volume'},
    {id:8, label:'COMMON.TOTAL_SUPPLY', field:'total_supply'}
  ];


  constructor() { }


  filterLinks(links: string[]): string[]{
    return links?.filter(item => !!item)
  }


}

