import INoteEntity from './Entity';

export default interface INoteForm {
  note: INoteEntity;
  allowedUsers: string[];
}
