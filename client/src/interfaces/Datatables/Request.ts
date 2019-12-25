export default interface IDatatablesRequest {
  url: string;
  type: string;
  headers?: {
    Authorization?: string;
  }
}
