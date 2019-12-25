import { Response } from 'express';
import { Transaction } from 'sequelize';
import Note from '@/model/entities/note';
import IRequestNote from '@/interfaces/Note/RequestNote';
import INoteForm from '@/interfaces/Note/Form';
import NoteController from '@/controllers/Note';
import app from '@/app';

async function Update(req: IRequestNote, res: Response): Promise<void> {
  const data: INoteForm = req.body;

  try {
    await app.model.transaction(
      async (t: Transaction): Promise<void> => {
        await Note.update(data.note, {
          where: {
            id: req.note.id
          },
          transaction: t
        });

        const { removedUsers, addedUsers, leftUsers } = await NoteController.AllowUsers(
          req.note.id,
          [req.user.hash, ...data.allowedUsers],
          t
        );

        res.send();

        // Send update to current viewers
        data.note.hash = req.note.hash;
        for (const userId of removedUsers) {
          app.io
            .of('/api/notessocket')
            .to(userId.toString())
            .emit('removeNote', req.note.hash);
        }
        for (const userId of addedUsers) {
          app.io
            .of('/api/notessocket')
            .to(userId.toString())
            .emit('createNote', [data.note.hash, data.note.name, data.note.content]);
        }
        for (const userId of leftUsers) {
          app.io
            .of('/api/notessocket')
            .to(userId.toString())
            .emit('updateNote', [data.note]);
        }
      }
    );
  } catch (err) {
    app.logger.error('An error has occured when trying to update note', req.note.hash, err);
    res.status(500).send();
  }
}
export default Update;
