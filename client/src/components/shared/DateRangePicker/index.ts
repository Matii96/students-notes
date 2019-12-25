import 'bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import { Component, Vue, Prop } from 'vue-property-decorator';
import $ from 'jquery';
import config from '@/config';

@Component
export default class DateRangePicker extends Vue {
  @Prop({
    default: ''
  })
  private customId: string;
  private rangePicker: JQuery<HTMLElement>;

  public constructor() {
    super();
    this.rangePicker = null;
  }

  private get inputId(): string {
    return `dateRangePicker-${this.customId}`;
  }

  private PrepareDateRange(dateFrom: string | Date, dateTo: string | Date): [Date, Date] {
    return [new Date(dateFrom), new Date(dateTo)];
  }

  private mounted(): void {
    let now: Date = new Date();
    let from: Date = new Date(now);
    from.setHours(0, 0, 0, 0);
    let to: Date = new Date(now);
    to.setHours(23, 59, 58, 999);
    this.$emit('input', this.PrepareDateRange(from, to));

    let dateRangeInput: JQuery<HTMLInputElement> = $(`#${this.inputId}`);
    // @ts-ignore
    this.rangePicker = dateRangeInput.daterangepicker({
      timePicker: config.datePicker.timePicker,
      timePicker24Hour: config.datePicker.timePicker24Hour,
      timePickerIncrement: config.datePicker.timePickerIncrement,
      locale: config.datePicker.locale,
      startDate: from,
      maxDate: to
    });
    this.rangePicker.change((): void => {
      let dates: string[] = (this.rangePicker.val() as string).split('-');
      this.$emit('input', this.PrepareDateRange(dates[0], dates[1]));
    });
  }

  private destroyed(): void {
    this.rangePicker.remove();
  }
}
