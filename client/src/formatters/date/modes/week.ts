import IMode from '@/interfaces/Date/Mode';

const weekMode: IMode = class WeekMode {
  public static format = 'D MMMM';

  public static Range(from: Date, to: Date): void {
    from.setHours(0, 0, 0, 0);
    from.setDate(from.getDate() - 6);
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
export default weekMode;
