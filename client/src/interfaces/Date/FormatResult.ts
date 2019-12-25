export default interface IFormatResult {
  intervals: {[timeKeyFormatted: string]: any};
  data: {[timeKey: number]: any}
}