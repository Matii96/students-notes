import IMode from '@/interfaces/Date/Mode';

const dayMode: IMode = class MinuteMode {
  public static format = 'H:mm:ss';

  public static Range(from: Date, to: Date): void {
    from.setMinutes(from.getMinutes() - 1);
    from.setMilliseconds(0);
    to.setSeconds(to.getSeconds() - 1);
    to.setMilliseconds(0);
  }
  public static Aggregator(date: Date): number {
    const second: Date = new Date(date);
    second.setHours(second.getHours(), second.getMinutes(), second.getSeconds(), 0);
    return second.getTime();
  }
  public static Increment(date: Date): void {
    date.setSeconds(date.getSeconds() + 1);
  }
};
export default dayMode;
