import { Component, Vue } from 'vue-property-decorator';
import $ from 'jquery';

import 'bootstrap';

// Require needed datatables modules
import 'datatables.net';
import 'datatables.net-bs';
import 'datatables.net-buttons';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/elegant.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';

import 'bootstrap-slider';
//import 'bootstrap-slider/dist/bootstrap-slider.min';
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css';

import { install } from 'resize-observer';

import '@/formatters/charts';
import config from '@/config';

@Component
export default class App extends Vue {
  private created(): void {
    // Init resize-observer
    install();

    // Load datatables.net configuration
    // @ts-ignore
    $.extend(true, $.fn.dataTable.defaults, config.datatables.default);
  }
}
