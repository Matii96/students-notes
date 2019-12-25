export default interface IDatatablesResponse<Entry> {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Entry[];
}
