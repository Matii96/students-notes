import { Response } from 'express';
import IRequestNote from '@/interfaces/Note/RequestNote';
import app from '@/app';

async function Settings(req: IRequestNote, res: Response): Promise<void> {
  try {
    res.send({
      name: req.note.name,
      content: req.note.content
    });
  } catch (err) {
    app.logger.error('An error has occured when trying to get note settings', req.note.hash, err);
    res.status(500).send();
  }
}
export default Settings;
