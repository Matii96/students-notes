import ISocketAuthorisedUser from '@/interfaces/SocketAuthorised/User';
import app from '@/app';

function UpdateState(socket: ISocketAuthorisedUser, joined: boolean): void {
  if (joined) {
    if (!app.router.user.users[socket.user.id]) {
      app.router.user.users[socket.user.id] = {
        connections: 0
      };
    }
    app.router.user.users[socket.user.id].connections += 1;
  } else {
    app.router.user.users[socket.user.id].connections--;
    if (app.router.user.users[socket.user.id].connections === 0) {
      delete app.router.user.users[socket.user.id];
    }
  }

  // Sent update that user is online
  app.io.of('/api/userssocket').emit('updateUser', [
    {
      hash: socket.user.hash,
      online: app.router.user.users[socket.user.id] ? app.router.user.users[socket.user.id].connections : null
    }
  ]);
}
export default UpdateState;
