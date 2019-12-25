import { Response } from 'express';
import User from '@/model/entities/user';
import IRequestUser from '@/interfaces/User/RequestUser';
import app from '@/app';

async function Update(req: IRequestUser, res: Response): Promise<void> {
  try {
    await User.update(req.body, {
      where: {
        id: req.editUser.id
      }
    });
    res.send();

    // Send update to current viewers
    req.body.hash = req.editUser.hash;
    app.io.of('/api/userssocket').emit('updateUser', [req.body]);

    // Logout user if locked
    if (req.body.locked) {
      app.io
        .of('/api/clientsocket')
        .to(req.editUser.id.toString())
        .emit('logout');
    }
  } catch (err) {
    app.logger.error('An error has occured when trying to update user', req.user.hash, err);
    res.status(500).send();
  }
}
export default Update;
