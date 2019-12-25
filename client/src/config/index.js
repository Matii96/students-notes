export default {
  serviceName: 'Students notes',
  version: '2.0',
  serverURI: window.webpackHotUpdate ? 'http://localhost:9999/api/' : '/api/',
  maxAlerts: 5,
  alertDismissTimeout: 2,
  defaultLanguage: 'en',
  dateFormat: 'DD MMM YY H:mm:ss',
  typingDelay: 350,
  progressbar: {
    color: '#fff',
    failedColor: '#dc3545',
    thickness: '2px'
  },
  reports: {
    chunkSize: 5
  },
  datatables: {
    default: {
      info: false,
      autoWidth: false,
      responsive: true,
      dom:
        '<"row"<"col-sm-6"l><"col-sm-6"f>>' +
        '<"row"<"col-sm-12 table-responsive"tr>>' +
        '<"row"<"col-sm-5"i><"col-sm-7"p>>'
    },
    btnNewDom:
      '<"row"<"col-xs-12"<"form-inline"<"form-group"l><"dataTable-controls-right"<"form-group"f><"form-group dataTable-controls-btnNew"B>>>>>' +
      '<"row"<"col-sm-12 table-responsive"tr>>' +
      '<"row"<"col-sm-5"i><"col-sm-7"p>>'
  },
  datePicker: {
    timePicker: true,
    timePicker24Hour: true,
    timePickerIncrement: 5,
    locale: {
      format: 'MM.DD.YYYY HH:mm'
    }
  }
};
