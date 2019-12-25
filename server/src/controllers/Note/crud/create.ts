import { Response } from 'express';
import { Transaction } from 'sequelize';
import Note from '@/model/entities/note';
import IRequestAuthorised from '@/interfaces/RequestAuthorised/User';
import INoteForm from '@/interfaces/Note/Form';
import NoteController from '@/controllers/Note';
import app from '@/app';

async function Create(req: IRequestAuthorised, res: Response): Promise<void> {
  const data: INoteForm = req.body;

  // Check if note name is present
  if (!data.note.name) {
    res.status(400).send();
    app.logger.warn('Invalid note data', data, 'new note has no name');
    return;
  }
  try {
    await app.model.transaction(
      async (t: Transaction): Promise<void> => {
        const note: Note = await Note.create(data.note, {
          transaction: t
        });

        const { addedUsers } = await NoteController.AllowUsers(note.id, [req.user.hash, ...data.allowedUsers], t);

        // Send new note hash
        res.send(note.hash);

        // Send update to current viewers
        for (const userId of addedUsers) {
          app.io
            .of('/api/notessocket')
            .to(userId.toString())
            .emit('createNote', [note.hash, note.name, note.content]);
        }
      }
    );
  } catch (err) {
    app.logger.error('An error has occured when trying to create new note', err);
    res.status(500).send();
  }
}
export default Create;
