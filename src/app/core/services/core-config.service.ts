import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '../models/tokens';

export enum EndpointType {
  api = '/api/',
};

export interface CoreConfig {
  langs: string[];
};


@Injectable({
  providedIn: 'root'
})
export class CoreConfigService {

  protected _config: CoreConfig;


  constructor(@Inject(ENVIRONMENT) private _env: Environment) { }


  importConfig(coreConfigRaw: any): void {
    this._config = {
      langs: coreConfigRaw.Languages
    } as CoreConfig;
  }


  get baseEndpoint(): string {
    return `${this._env.baseEndpoint}`;
  }

  get perPage(): string {
    return `${this._env.perPage}`;
  }

}
