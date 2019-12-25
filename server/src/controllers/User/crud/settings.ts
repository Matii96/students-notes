import { Response } from 'express';
import IRequestEditUser from '@/interfaces/User/RequestUser';
import app from '@/app';
import IUserEntity from '@/interfaces/User/Entity';

async function Settings(req: IRequestEditUser, res: Response): Promise<void> {
  try {
    // Basic data
    const data: IUserEntity = {
      name: req.editUser.name,
      description: req.editUser.description,
      email: req.editUser.email,
      lang: req.editUser.lang
    };

    // Data for editing other user
    if (req.params.hash !== req.user.hash) {
      data.role = req.editUser.roleId;
      data.locked = req.editUser.locked;
    }

    res.send(data);
  } catch (err) {
    app.logger.error('An error has occured when trying to get user data', req.user.hash, err);
    res.status(500).send();
  }
}
export default Settings;
