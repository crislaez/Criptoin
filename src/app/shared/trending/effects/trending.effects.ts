import { Injectable } from '@angular/core';
import { NotificationActions } from '@criptoin/shared/notification';
import { EntityStatus } from '@criptoin/shared/utils/models';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as TrendingActions from '../actions/trending.actions';
import { TrendingService } from '../services/trending.service';


@Injectable()
export class TrendingEffects implements OnInitEffects {

  loadTrending$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrendingActions.loadTrending),
      switchMap(() => {
        return this._trending.getTrending().pipe(
          map(({trending}) => TrendingActions.saveTrending({ trending, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              TrendingActions.saveTrending({ trending:[], error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_TRENDING'})
            )
          })
        )
      })
    )
  });


  ngrxOnInitEffects() {
    return TrendingActions.loadTrending()
  };


  constructor(
    private actions$: Actions,
    private _trending: TrendingService,
    public toastController: ToastController,
  ) { }


}
