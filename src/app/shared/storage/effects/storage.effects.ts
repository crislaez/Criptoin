import { Injectable } from '@angular/core';
import { NotificationActions } from '@criptoin/shared/notification';
import { EntityStatus } from '@criptoin/shared/utils/models';
import { ToastController } from '@ionic/angular';
import { Actions, concatLatestFrom, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { fromStorage } from '..';
import * as StorageActions from '../actions/storage.actions';
import { StorageService } from '../services/storage.service';


@Injectable()
export class StorageEffects implements OnInitEffects {


  loadCoins$ = createEffect( () =>
    this.actions$.pipe(
      ofType(
        StorageActions.loadCoins,
        StorageActions.insertCoinSuccess,
        StorageActions.deleteCoinSuccess
      ),
      switchMap( () =>
        this._storage.getAllCoins().pipe(
          map((coins) => StorageActions.saveCoins({ coins, error:undefined, status: EntityStatus.Loaded })),
          catchError((error) => of(StorageActions.saveCoins({ coins: [], error, status: EntityStatus.Loaded }))),
        )
      )
    )
  );

  insertVerse$ = createEffect( () =>
    this.actions$.pipe(
      ofType(StorageActions.insertCoin),
      concatLatestFrom(() => this.store.select(fromStorage.selectStorageCoins)),
      switchMap(([{ coinId }, storageCoins]) => {
        if(storageCoins?.length >= 20) return of(NotificationActions.notificationFailure({message:'COMMON.FAILED_SAVE_20_CRIPTO_MORE'}));

        return this._storage.insetCoin(coinId).pipe(
          switchMap( () => of(
            StorageActions.insertCoinSuccess(),
            NotificationActions.notificationSuccess({message:'COMMON.SAVE_COIN_SUCCESS'})
          )),
          catchError((error) => of(
            StorageActions.insertCoinFailure({ error }),
            NotificationActions.notificationFailure({message:'COMMON.SAVE_COIN_FAILURE'})
          )),
        )
      })
    )
  );

  deleteVerse$ = createEffect( () =>
    this.actions$.pipe(
      ofType(StorageActions.deleteCoin),
      switchMap(({ coinId }) =>
        this._storage.deleteCoin(coinId).pipe(
          switchMap( () => of(
            StorageActions.deleteCoinSuccess(),
            NotificationActions.notificationSuccess({message:'COMMON.DELETE_COIN_SUCCESS'})
          )),
          catchError((error) => of(
            StorageActions.deleteCoinFailure({ error }),
            NotificationActions.notificationFailure({message:'COMMON.DELETE_COIN_FAILURE'})
          )),
        )
      )
    )
  );

  rechargeLoadCoins$ = createEffect( () =>
    this.actions$.pipe(
      ofType(
        StorageActions.rechargeLoadCoins,
      ),
      switchMap(({coinsId}) => {
        const data$ = coinsId?.length > 0 ? this._storage.getCoinsByIds(coinsId) : of([])
        return data$.pipe(
          map((coins) => StorageActions.saveRechargeLoadCoins({ coins, error:undefined, status: EntityStatus.Loaded })),
          catchError((error) => of(StorageActions.saveRechargeLoadCoins({ coins: [], error, status: EntityStatus.Error }))),
        )
      })
    )
  );


  ngrxOnInitEffects() {
    return StorageActions.loadCoins();
  };


  constructor(
    private actions$: Actions,
    private _storage: StorageService,
    private store: Store,
    public toastController: ToastController,
  ){ }


}
