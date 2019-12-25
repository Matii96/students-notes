export default interface IMode {
  format: string;
  Range(from: Date, to: Date): void;
  Aggregator(loggedAt: Date): number;
  Increment(date: Date): void;
}
