import ISocketNote from '@/interfaces/Note/SocketNote';
import app from '@/app';

function UpdateParticipants(socket: ISocketNote, joined: boolean): void {
  try {
    // If participant has joined then add him to list
    // Otherwise remove him and note room if he was the last one
    if (joined) {
      if (app.router.note.openNotes[socket.note.id] === undefined) {
        app.router.note.openNotes[socket.note.id] = {
          participants: {}
        };
      }
      if (app.router.note.openNotes[socket.note.id].participants[socket.user.id] === undefined) {
        app.router.note.openNotes[socket.note.id].participants[socket.user.id] = {
          name: socket.user.name,
          hash: socket.user.hash,
          count: 0
        };
      }
      app.router.note.openNotes[socket.note.id].participants[socket.user.id].count++;
      socket.emit('participants', Object.values(app.router.note.openNotes[socket.note.id].participants));
    } else {
      // Check if all socket.user's instances has been disconnected
      if (app.router.note.openNotes[socket.note.id].participants[socket.user.id].count === 1) {
        delete app.router.note.openNotes[socket.note.id].participants[socket.user.id];

        // Check if no one left in room
        if (Object.keys(app.router.note.openNotes[socket.note.id].participants).length === 0) {
          delete app.router.note.openNotes[socket.note.id];
        } else {
          socket
            .to(socket.note.id)
            .emit('participants', Object.values(app.router.note.openNotes[socket.note.id].participants));
        }
      } else {
        app.router.note.openNotes[socket.note.id].participants[socket.user.id].count--;
        socket
          .to(socket.note.id)
          .emit('participants', Object.values(app.router.note.openNotes[socket.note.id].participants));
      }
    }

    // Send update to all notes and new user
    if (joined) {
      socket.emit('participants', Object.values(app.router.note.openNotes[socket.note.id].participants));
    }
    if (app.router.note.openNotes[socket.note.id] && Object.keys(app.router.note.openNotes).length > 0) {
      socket
        .to(socket.note.id)
        .emit('participants', Object.values(app.router.note.openNotes[socket.note.id].participants));
    }
  } catch (err) {
    app.logger.warn('Exception occurred during updating note participants list', socket.note.hash, err);
  }
}
export default UpdateParticipants;
