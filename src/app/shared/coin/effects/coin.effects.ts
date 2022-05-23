import { Injectable } from '@angular/core';
import { NotificationActions } from '@criptoin/shared/notification';
import { EntityStatus } from '@criptoin/shared/utils/models';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as CoinActions from '../actions/coin.actions';
import { CoinService } from '../services/coin.service';


@Injectable()
export class CoinEffects implements OnInitEffects {

  loadCoins$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoinActions.loadCoins),
      switchMap(({ page, filter }) => {
        return this._coin.getAllCoins(page, filter).pipe(
          map((coins) => CoinActions.saveCoins({ coins, filter, page, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              CoinActions.saveCoins({ coins:[], page, filter:null, error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_COINS'})
            )
          })
        )
      })
    )
  });

  loadCoin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoinActions.loadCoin),
      switchMap(({ coin, chartDays }) => {
        return this._coin.getCoinById(coin, chartDays).pipe(
          map((coin) => CoinActions.saveCoin({ coin, error: undefined, status: EntityStatus.Loaded })),
          catchError(error => {
            return of(
              CoinActions.saveCoin({ coin:{}, error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_COIN'})
            )
          })
        )
      })
    )
  });

  loadTotalCoins$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoinActions.loadTotalCoins),
      switchMap(() => {
        return this._coin.getTotalCoins().pipe(
          map((totalCount) => CoinActions.saveTotalCoins({ totalCount, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              CoinActions.saveTotalCoins({ totalCount:0, error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_TOTAL_COINS'})
            )
          })
        )
      })
    )
  });


  ngrxOnInitEffects() {
    return CoinActions.loadTotalCoins()
  };



  constructor(
    private actions$: Actions,
    private _coin: CoinService,
    public toastController: ToastController,
  ) { }


}
