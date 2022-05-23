import { InjectionToken } from '@angular/core';

export interface Environment {
  production: boolean;
  baseEndpoint: string;
  perPage: number;
}

export const ENVIRONMENT = new InjectionToken<Environment>('environment');
