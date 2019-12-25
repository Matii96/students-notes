import SocketAuthorised from '@/interfaces/SocketAuthorised/User';
import Note from '@/model/entities/note';

export default interface ISocketNote extends SocketAuthorised {
  note: Note;
}
