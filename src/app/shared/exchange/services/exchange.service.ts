import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@criptoin/core/services/core-config.service';
import { Filter } from '@criptoin/shared/coin';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Exchange, TotalCoinsResposne } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  baseURL: string = `${this._coreConfig.baseEndpoint}`;
  perPage: string = `${this._coreConfig.perPage}`;


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getAllExchanges(page:string, filter: Filter): Observable<Exchange[]> {
    const { id = null } = filter || {};

    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('per_page', this.perPage);
    // if(id) params = params.append('ids', id);

    return this.http.get<Exchange[]>(`${this.baseURL}/exchanges`, { params, observe: 'response' }).pipe(
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
    return this.http.get<TotalCoinsResposne[]>(`${this.baseURL}/exchanges/list`).pipe(
      map((response): any => {
        return response?.length || 0;
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }

  getExchangeById(exchange: Exchange, chartDays:number): Observable<Exchange> {
    const { id = null } = exchange || {};

    return this.http.get<Exchange>(`${this.baseURL}/exchanges/${id}`).pipe(
      switchMap((completeExchange) => {
        const { id = null } = exchange || {};
        return this.getMarketChartExchange(id, chartDays).pipe(
            map((marketChart): Exchange => {
              return {
                ...exchange,
                ...(completeExchange ? completeExchange : {}),
                ...(marketChart ? {marketChart} : {})
              }
            }),
            catchError((error) => of({...exchange,...(completeExchange ? completeExchange : {})}))
          )
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }

  getMarketChartExchange(id: string, chartDays:number): Observable<any> {
    let params = new HttpParams();
    params = params.append('days', chartDays);

    return this.http.get<any>(`${this.baseURL}/exchanges/${id}/volume_chart`,{params}).pipe(
      map((res) => (res || {})),
      catchError((error) => {
        return throwError(error)
      })
    )
  }


}
