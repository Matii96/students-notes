import ISocketEditUser from '@/interfaces/User/SocketUser';

function UpdateMeta(socket: ISocketEditUser): void {
  socket.emit('updateMeta', {
    name: socket.editUser.name,
    description: socket.editUser.description
  });
}
export default UpdateMeta;
