import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@criptoin/core/services/core-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Trending } from './../models/index';


@Injectable({
  providedIn: 'root'
})
export class TrendingService {

  baseURL: string = `${this._coreConfig.baseEndpoint}`;


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getTrending(): Observable<{trending: Trending[]}> {
    return this.http.get<any>(`${this.baseURL}/search/trending`).pipe(
      map((response): any => {
        const { coins = null} = response || {};
        return { trending: (coins || [])?.map(({item}) => (item))?.slice(0, 7) }
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }
}
