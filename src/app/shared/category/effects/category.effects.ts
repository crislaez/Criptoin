import { Injectable } from '@angular/core';
import { NotificationActions } from '@criptoin/shared/notification';
import { EntityStatus } from '@criptoin/shared/utils/models';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as CategoryActions from '../actions/category.actions';
import { CategoryService } from '../services/category.service';


@Injectable()
export class CategoryEffects implements OnInitEffects {

  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      switchMap(() => {
        return this._category.getCategories().pipe(
          map(({categories}) => CategoryActions.saveCategories({ categories, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              CategoryActions.saveCategories({ categories:[], error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_CATEGORIES'})
            )
          })
        )
      })
    )
  });


  ngrxOnInitEffects() {
    return CategoryActions.loadCategories()
  };



  constructor(
    private actions$: Actions,
    private _category: CategoryService,
    public toastController: ToastController,
  ) { }


}
