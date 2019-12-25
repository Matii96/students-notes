export default interface IDataform {
  Submit: (...data: any[]) => Promise<void>;
}
