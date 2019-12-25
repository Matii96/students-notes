import ISocketNote from '@/interfaces/Note/SocketNote';
import INoteEntity from '@/interfaces/Note/Entity';
import app from '@/app';
import Note from '@/model/entities/note';

async function Synchronize(socket: ISocketNote, data: INoteEntity): Promise<void> {
  try {
    await Note.update(data, {
      where: {
        id: socket.note.id
      }
    });
    socket.to(socket.note.id).broadcast.emit('synchronize', data);
  } catch (err) {
    app.logger.error('An error has occured when trying to synchronize note', socket.note.hash, data, err);
  }
}
export default Synchronize;
