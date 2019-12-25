import ISocketNote from '@/interfaces/Note/SocketNote';

function UpdateMeta(socket: ISocketNote): void {
  socket.emit('updateMeta', {
    name: socket.note.name
  });
}
export default UpdateMeta;
