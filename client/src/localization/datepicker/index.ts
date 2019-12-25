import config from '@/config';

async function DatepickerLocalization(lang: string): Promise<void> {
  let resource: { [key: string]: string } = await import(`./${lang}.json`);
  for (let key in resource) {
    config.datePicker.locale[key] = resource[key];
  }
}
export default DatepickerLocalization;
