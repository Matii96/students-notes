import { Response } from 'express';
import User from '@/model/entities/user';
import Role from '@/model/entities/role';
import IRequestAuthorised from '@/interfaces/RequestAuthorised/User';
import app from '@/app';

async function Create(req: IRequestAuthorised, res: Response): Promise<void> {
  try {
    // Check if user name is present
    if (!req.body.name) {
      res.status(400).send();
      app.logger.warn('Invalid user data', req, 'new user has no name');
    }

    const user: User = await User.create(req.body);
    res.send(user.hash);

    // Get user role
    const userInfo: User = await User.findOne({
      where: {
        id: user.id
      },
      include: [
        {
          model: Role,
          attributes: ['name']
        }
      ]
    });

    // Send update to current viewers, only admins
    app.io.of('/api/userssocket').emit('createUser', [
      user.hash,
      user.name,
      user.description,
      user.email,
      userInfo.role ? userInfo.role.name : null,
      user.locked,
      null // User is offline by default
    ]);
  } catch (err) {
    app.logger.error("Couldn't create user", req.user.hash, err);
  }
}
export default Create;
