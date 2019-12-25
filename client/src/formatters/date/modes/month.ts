import IMode from '@/interfaces/Date/Mode';

const monthMode: IMode = class MonthMode {
  public static format = 'D MMM';

  public static Range(from: Date, to: Date): void {
    from.setHours(24, 0, 0, 0);
    from.setMonth(from.getMonth() - 1);
    to.setHours(23, 59, 59, 999);
  }
  public static Aggregator(date: Date): number {
    let day: Date = new Date(date);
    day.setHours(0, 0, 0, 0);
    return day.getTime();
  }
  public static Increment(date: Date): void {
    date.setDate(date.getDate() + 1);
  }
};
export default monthMode;
