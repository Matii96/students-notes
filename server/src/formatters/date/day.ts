import IMode from '@/interfaces/Date/Mode';

const dayMode: IMode = class DayMode {
  public static format = 'dd H:mm';

  public static Range(from: Date, to: Date): void {
    from.setHours(from.getHours() - 23, 0, 0, 0);
    to.setHours(to.getHours(), 59, 59, 999);
  }
  public static Aggregator(date: Date): number {
    const hour: Date = new Date(date);
    hour.setHours(hour.getHours(), 0, 0, 0);
    return hour.getTime();
  }
  public static Increment(date: Date): void {
    date.setHours(date.getHours() + 1);
  }
};
export default dayMode;
