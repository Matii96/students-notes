import { Response, NextFunction } from 'express';
import Note from '@/model/entities/note';
import User from '@/model/entities/user';
import UserNote from '@/model/entities/userNote';
import IAccess from '@/interfaces/Policy/Access';
import IRequestEditNote from '@/interfaces/Note/RequestNote';
import ISocketEditNote from '@/interfaces/Note/SocketNote';
import app from '@/app';

const NoteAccess: IAccess = class NoteAccess {
  public static async CheckAccess(hash: string, user: User): Promise<number | Note> {
    try {
      const note: Note = await Note.findOne({
        where: {
          hash
        }
      });
      if (note === null) {
        return 404;
      }

      // Check if user has access to note
      const userNote: UserNote = await UserNote.findOne({
        where: {
          userId: user.id,
          noteId: note.id
        }
      });
      if (userNote === null) {
        return 403;
      }

      return note;
    } catch (err) {
      app.logger.error('An error has occured when trying to access note panel', hash, err);
      return 500;
    }
  }
  public static async Rest(req: IRequestEditNote, res: Response, next: NextFunction): Promise<void> {
    const result: number | Note = await NoteAccess.CheckAccess(req.params.hash, req.user);
    if (typeof result === 'number') {
      res.status(result).send();
      return;
    }
    req.note = result;
    next();
  }
  public static async Socket(socket: ISocketEditNote, next: () => void): Promise<void> {
    const result: number | Note = await NoteAccess.CheckAccess(socket.handshake.query.hash, socket.user);
    if (typeof result === 'number') {
      socket.disconnect();
      return;
    }
    socket.note = result;
    next();
  }
};
export default NoteAccess;
