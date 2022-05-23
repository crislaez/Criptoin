import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EntityStatus } from '@criptoin/shared/utils/models';

@Component({
  selector: 'app-infinite-scroll',
  template:`
    <ng-container *ngIf="slice < total">
      <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
        <ion-infinite-scroll-content class="loadingspinner">
          <app-spinner [top]="'0%'" *ngIf="$any(status) === 'pending'"></app-spinner>
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ng-container>
  `,
  styleUrls: ['./infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollComponent {

  @Input() slice: number;
  @Input() status: EntityStatus;
  @Input() total: number;
  @Output() loadDataTrigger = new EventEmitter<{event, total}>();


  constructor() { }


  loadData(event, total): void{
    this.loadDataTrigger.next({event, total})
  }

}
