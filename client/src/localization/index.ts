import moment from 'moment';
import datatables from './datatables';
import datepicker from './datepicker';

import config from '@/config';
import axios, { AxiosInstance } from 'axios';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ICachedLanguage from '@/interfaces/Localization/CachedLanguage';

Vue.use(VueI18n);

class Localization {
  private readonly cachedLanguages: { [lang: string]: ICachedLanguage };
  private readonly api: AxiosInstance;
  public readonly i18n: VueI18n;

  public constructor() {
    this.cachedLanguages = {};
    this.api = axios.create({
      baseURL: '/'
    });
    this.i18n = new VueI18n({
      locale: config.defaultLanguage,
      fallbackLocale: config.defaultLanguage,
      messages: {}
    });
    this.LoadLanguage(config.defaultLanguage);
  }

  private LoadLanguage(lang: string): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        if (this.cachedLanguages[lang]) {
          resolve();
          return;
        }

        try {
          // Get localization from server
          let [localization] = await Promise.all([
            this.api.get(`localization/general/${lang}.json`)
            // another localization
          ]);

          this.i18n.setLocaleMessage(lang, localization.data);
          this.cachedLanguages[lang] = {
            general: localization.data
          };
          resolve();
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  public async ChangeLanguage(lang: string): Promise<void> {
    try {
      moment.locale(lang);
      datatables(lang);
      datepicker(lang);
      await this.LoadLanguage(lang);
      this.i18n.locale = lang;
    } catch (err) {
      console.error(`Couldn't load language ${lang}`, err);
    }
  }
}

export default new Localization();
