import IMode from '@/interfaces/Date/Mode';

const yearMode: IMode = class YearMode {
  public static format = 'MMM YYYY';

  public static Range(from: Date, to: Date): void {
    from.setFullYear(from.getFullYear() - 1);
    from.setMonth(from.getMonth() + 1);
    from.setDate(1);
    from.setHours(0, 0, 0, 0);
    to.setMonth(to.getMonth() + 1);
    to.setDate(1);
    to.setHours(0, 0, 0, -1);
  }
  public static Aggregator(date: Date): number {
    const month: Date = new Date(date);
    month.setHours(0, 0, 0, 0);
    month.setDate(1);
    return month.getTime();
  }
  public static Increment(date: Date): void {
    date.setMonth(date.getMonth() + 1);
  }
};
export default yearMode;
