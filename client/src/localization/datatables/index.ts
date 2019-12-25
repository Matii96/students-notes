import $ from 'jquery';

async function DatatablesLocalization(lang: string): Promise<void> {
  let resource: { [key: string]: string } = await import(`./${lang}.json`);
  $.extend(true, $.fn.dataTable.defaults, {
    language: resource
  });
}
export default DatatablesLocalization;
