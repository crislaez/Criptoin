import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { CoreConfigService } from '@criptoin/core/services/core-config.service';
import { Coin } from '@criptoin/shared/coin';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  readonly storageCoins = 'CiptoinCoinsKey';
  baseURL: string = `${this._coreConfig.baseEndpoint}`;

  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getAllCoins(): Observable<any>{
    return from(this.loadStorageCoins(this.storageCoins)).pipe(
      map(coins => (coins || []))
    )
  }

  insetCoin(coinId: string): Observable<any>{
    return from(this.loadStorageCoins(this.storageCoins)).pipe(
      tap(storageVerses => {
        const notRepeatCoins = (storageVerses || [])?.filter((id) => id !== coinId);

        const body = [
          ...(notRepeatCoins?.length > 0 ? notRepeatCoins : []),
          ...(coinId ? [coinId] : [])
        ];

        this.saveStorageCoins(body, this.storageCoins)
      })
    );
  }

  deleteCoin(coinId: string): Observable<any>{
    return from(this.loadStorageCoins(this.storageCoins)).pipe(
      tap(storageCoins => {
        const filterCoins = (storageCoins || [])?.filter((id) => id !== coinId);
        this.saveStorageCoins(filterCoins, this.storageCoins);
      })
    );
  }

  async loadStorageCoins(key:string){
    const verse = await Storage.get({key})
    return await JSON.parse(verse?.value) || [];
  }

  async saveStorageCoins(verse: any, key:string){
    await Storage.set({key, value: JSON.stringify(verse)})
  }

  getCoinsByIds(ids:string[]): Observable<Coin[]> {
    let params = new HttpParams();
    params = params.append('ids', ids?.toString());
    params = params.append('per_page', '-1');

    return this.http.get<Coin[]>(`${this.baseURL}/coins/markets?vs_currency=usd&price_change_percentage=1h`,{ params }).pipe(
      map((res): any => {
        return res || []
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }


}
