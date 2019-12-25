import { Application } from 'express';
import { Server, Namespace } from 'socket.io';
import Note from '@/controllers/Note';
import Authorization from '@/policies/authorization';
import AccessNote from '@/policies/access/Note';
import ValidateNote from '@/policies/validation/Note';
import IRoute from '@/interfaces/Router';
import INoteEntity from '@/interfaces/Note/Entity';
import ISocketEditNote from '@/interfaces/Note/SocketNote';
import ISocketAuthorised from '@/interfaces/SocketAuthorised/User';
import IOpenNote from '@/interfaces/Note/OpenNote';

export default class NoteRouter implements IRoute {
  public readonly openNotes: { [noteId: number]: IOpenNote };

  public constructor() {
    this.openNotes = {};
  }

  public async Rest(express: Application): Promise<void> {
    express.get('/api/notes', Authorization.User.Rest([1, 2]), Note.List);
    express.get('/api/note/:hash/settings', Authorization.User.Rest([1, 2]), AccessNote.Rest, Note.Settings);

    express.post('/api/notes', Authorization.User.Rest([1, 2]), ValidateNote.Rest, Note.Create);
    express.patch('/api/note/:hash', Authorization.User.Rest([1, 2]), AccessNote.Rest, ValidateNote.Rest, Note.Update);
    express.delete('/api/note/:hash', Authorization.User.Rest([1, 2]), AccessNote.Rest, Note.Delete);
  }
  public async Io(io: Server): Promise<void> {
    const nsp: Namespace = io.of('/api/notesocket');
    nsp.use(Authorization.User.Socket([1, 2]));
    nsp.use(AccessNote.Socket);
    nsp.on('connection', (socket: ISocketEditNote): void => {
      let workspaceInitialized = false;

      // Join to room of note
      socket.join(socket.note.id);

      Note.UpdateMeta(socket);

      socket.on('joinWorkspace', (): void => {
        workspaceInitialized = true;
        Note.Workspace.UpdateParticipants(socket, true);
        Note.Workspace.Init(socket);
      });
      socket.on('synchronize', (data: INoteEntity): void => {
        Note.Workspace.Synchronize(socket, data);
      });
      socket.on('disconnect', (): void => {
        if (workspaceInitialized) {
          Note.Workspace.UpdateParticipants(socket, false);
        }
      });
      socket.on('leaveWorkspace', (): void => {
        workspaceInitialized = false;
        Note.Workspace.UpdateParticipants(socket, false);
      });
    });

    // Socket for list of notes
    const nspList: Namespace = io.of('/api/notessocket');
    nspList.use(Authorization.User.Socket([1, 2]));
    nspList.on('connection', (socket: ISocketAuthorised): void => {
      socket.join(socket.user.id);

      socket.on(
        'getUsersList',
        async (noteHash: string): Promise<void> => {
          socket.emit('setUsersList', await Note.GetSelectedUsers(socket, noteHash));
        }
      );
    });
  }
}
