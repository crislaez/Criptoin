import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@criptoin/core/services/core-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseURL: string = `${this._coreConfig.baseEndpoint}`;

  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getCategories(): Observable<{categories: Category[]}> {
    return this.http.get<any>(`${this.baseURL}/coins/categories`).pipe(
      map((response): any => {
        return { categories: response || [] }
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }


}
