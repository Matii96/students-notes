import RequestAuthorised from '@/interfaces/RequestAuthorised/User';
import Note from '@/model/entities/note';

export default interface IRequestNote extends RequestAuthorised {
  note: Note;
}
