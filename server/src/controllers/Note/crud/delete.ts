import { Response } from 'express';
import Note from '@/model/entities/note';
import UserNote from '@/model/entities/userNote';
import IRequestNote from '@/interfaces/Note/RequestNote';
import app from '@/app';

async function Delete(req: IRequestNote, res: Response): Promise<void> {
  try {
    await Note.destroy({
      where: {
        id: req.note.id
      }
    });
    res.send();

    // Send update to current viewers
    const ownersIds: number[] = await UserNote.findAll({
      attributes: ['userId'],
      where: {
        noteId: req.note.id
      }
    }).map((userNote: UserNote): number => userNote.userId);
    for (const ownerId of ownersIds) {
      app.io
        .of('/api/notessocket')
        .to(ownerId.toString())
        .emit('removeNote', req.note.hash);
    }
    app.io
      .of('/api/notesocket')
      .to(req.note.id.toString())
      .emit('removeNote');
  } catch (err) {
    app.logger.error('An error has occured when trying to delete note', req.note.hash, err);
    res.status(500).send();
  }
}
export default Delete;
