import { Injectable } from '@angular/core';
import { NotificationActions } from '@criptoin/shared/notification';
import { EntityStatus } from '@criptoin/shared/utils/models';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as ExchangeActions from '../actions/exchange.actions';
import { ExchangeService } from '../services/exchange.service';


@Injectable()
export class ExchangeEffects implements OnInitEffects {

  loadExchanges$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExchangeActions.loadExchanges),
      switchMap(({ page, filter }) => {
        return this._exchange.getAllExchanges(page, filter).pipe(
          map((exchanges) => ExchangeActions.saveExchanges({ exchanges, filter, page, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              ExchangeActions.saveExchanges({ exchanges:[], page, filter:null, error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_EXCHANGES'})
            )
          })
        )
      })
    )
  });

  loadExchange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExchangeActions.loadExchange),
      switchMap(({ exchange, chartDays }) => {
        return this._exchange.getExchangeById(exchange, chartDays).pipe(
          map((exchange) => ExchangeActions.saveExchange({ exchange, error: undefined, status: EntityStatus.Loaded })),
          catchError(error => {
            return of(
              ExchangeActions.saveExchange({ exchange:{}, error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_EXCHANGE'})
            )
          })
        )
      })
    )
  });

  loadTotalExchanges$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExchangeActions.loadTotalExchanges),
      switchMap(() => {
        return this._exchange.getTotalCoins().pipe(
          map((totalCount) => ExchangeActions.saveTotalExchanges({ totalCount, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              ExchangeActions.saveTotalExchanges({ totalCount:0, error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_TOTAL_EXCHANGES'})
            )
          })
        )
      })
    )
  });


  ngrxOnInitEffects() {
    return ExchangeActions.loadTotalExchanges()
  };



  constructor(
    private actions$: Actions,
    private _exchange: ExchangeService,
    public toastController: ToastController,
  ) { }


}
