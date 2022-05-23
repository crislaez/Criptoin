import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@criptoin/core/services/core-config.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Coin, Filter, TotalCoinsResposne } from '../models';


@Injectable({
  providedIn: 'root'
})
export class CoinService {

  baseURL: string = `${this._coreConfig.baseEndpoint}`;
  perPage: string = `${this._coreConfig.perPage}`;


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getAllCoins(page:string, filter: Filter): Observable<Coin[]> {
    const { id = null } = filter || {};

    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('per_page', this.perPage);
    if(id) params = params.append('ids', id);

    return this.http.get<Coin[]>(`${this.baseURL}/coins/markets?vs_currency=usd&price_change_percentage=1h`, { params, observe: 'response' }).pipe(
      map((res): any => {
        const { body: coins = null} = res || {}
        return coins || []
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }

  getTotalCoins(): Observable<number> {
    return this.http.get<TotalCoinsResposne[]>(`${this.baseURL}/coins/list`).pipe(
      map((response): any => {
        return response?.length || 0;
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }

  getCoinById(coin: Coin, chartDays:number): Observable<any> {
    const { id = null } = coin || {};

    return this.http.get<any>(`${this.baseURL}/coins/${id}`).pipe(
      switchMap((response) => {
        const { links = null, description = null} = response || {};
        const { en = null } = description || {};

        return this.getMarketChartCoin(id, chartDays).pipe(
          map(marketChart => ({...response, ...coin, links, description:en, marketChart})),
          catchError(() => of({...response, ...coin, links, description:en}))
        )
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }

  getMarketChartCoin(id:string, chartDays:number): Observable<number> {
    let params = new HttpParams();
    params = params.append('vs_currency', 'usd');
    params = params.append('days', chartDays);

    return this.http.get<TotalCoinsResposne[]>(`${this.baseURL}/coins/${id}/market_chart`, { params }).pipe(
      map((response): any => {
        return response || {}
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }

}

