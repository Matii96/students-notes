import { Response } from 'express';
import Note from '@/model/entities/note';
import UserNote from '@/model/entities/userNote';
import IRequestAuthorised from '@/interfaces/RequestAuthorised/User';
import app from '@/app';

type entry = [string, string, string, Date];

async function List(req: IRequestAuthorised, res: Response): Promise<void> {
  try {
    const userNotes: UserNote[] = await UserNote.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Note,
          required: true,
          attributes: ['hash', 'name', 'content', 'updatedAt']
        }
      ]
    });
    const notes = userNotes.map(
      (userNote: UserNote): entry => {
        return [userNote.note.hash, userNote.note.name, userNote.note.content, userNote.note.updatedAt];
      }
    );
    res.send(notes);
  } catch (err) {
    app.logger.error('An error has occured when trying to get notes list', err);
    res.status(500).send();
  }
}
export default List;
