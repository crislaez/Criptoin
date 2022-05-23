import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Storage } from '@capacitor/storage'; //APP

const LANG = 'criptoinLang';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../assets/i18n/', '.json');
}


// APP
export const appInitTranslations = async (translate: TranslateService, languages: string[], defaultLang: string): Promise<any> => {
  const item = await Storage.get({key: LANG});
  const storeLang = item?.value || '';
  const currentDefaultLang = storeLang || defaultLang;

  return new Promise<void>(resolve => {
    translate.addLangs(languages);
    saveLang(currentDefaultLang);
    translate.setDefaultLang(currentDefaultLang);
    translate.use(currentDefaultLang).subscribe(() => resolve());
  });
}

const saveLang = async (lang: string) => {
  await Storage.set({key: LANG, value: lang})
}

// WEB
// export function appInitTranslations(translate: TranslateService, languages: string[], defaultLang: string): Promise<any> {
//   const borwserLang = translate.getBrowserLang();
//   const storeLang = localStorage.getItem(LANG);
//   const currentDefaultLnag = storeLang || (languages.includes(borwserLang) && borwserLang) || defaultLang

//   return new Promise<void>(resolve => {
//     translate.addLangs(languages);
//     localStorage.setItem(LANG, currentDefaultLnag)
//     translate.setDefaultLang(currentDefaultLnag);
//     translate.use(currentDefaultLnag).subscribe(() => resolve());
//   });
// }
