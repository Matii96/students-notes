export default interface IDatatablesRequest {
  draw: number;
  start: number;
  length: number;
  columns: {
    data?: string;
    name?: string;
    searchable?: string;
    orderable?: string;
    search: {
      value: string;
    };
  }[];
  order: {
    column: string;
    dir: 'ASC' | 'DESC';
  }[];
  search: {
    value: string;
  };
}
