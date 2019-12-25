import { Response } from 'express';
import User from '@/model/entities/user';
import IRequestUser from '@/interfaces/User/RequestUser';
import app from '@/app';

async function Delete(req: IRequestUser, res: Response): Promise<void> {
  try {
    await User.destroy({
      where: {
        id: req.editUser.id
      }
    });
    res.send();

    // Send update to current viewers
    app.io.of('/api/userssocket').emit('removeUser', req.editUser.hash);
    app.io
      .of('/api/usersocket')
      .to(req.editUser.id.toString())
      .emit('removeUser');
  } catch (err) {
    app.logger.error('An error has occured when trying to delete user', req.user.hash, err);
    res.status(500).send();
  }
}
export default Delete;
