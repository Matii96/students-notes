import ISocketNote from '@/interfaces/Note/SocketNote';
import Note from '@/model/entities/note';
import app from '@/app';

async function Init(socket: ISocketNote, note?: Note): Promise<void> {
  try {
    if (socket) {
      socket.emit('initNote', socket.note.content);
    } else {
      app.io
        .of('/api/notesocket')
        .to(note.id)
        .emit('initNote', note.content);
    }
  } catch (err) {
    app.logger.error('An error has occured when trying to init note workspace', socket.note.hash, err);
  }
}
export default Init;
