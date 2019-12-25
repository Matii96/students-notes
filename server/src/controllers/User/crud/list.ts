import { Response } from 'express';
import IRequestAuthorised from '@/interfaces/RequestAuthorised/User';
import User from '@/model/entities/user';
import Role from '@/model/entities/role';
import app from '@/app';

type entry = [string, string, string, string, string, boolean, number];

async function List(req: IRequestAuthorised, res: Response): Promise<void> {
  try {
    const users: entry[] = await User.findAll({
      attributes: ['id', 'name', 'description', 'hash', 'email', 'locked'],
      include: [
        {
          model: Role,
          attributes: ['name']
        }
      ]
    }).map(
      (user: User): entry => {
        return [
          user.hash,
          user.name,
          user.description,
          user.email,
          user.role.name,
          user.locked,
          app.router.user.users[user.id] ? app.router.user.users[user.id].connections : null
        ];
      }
    );

    res.send(users);
  } catch (err) {
    app.logger.error('An error has occured when trying to get users list', err);
    res.status(500).send();
  }
}
export default List;
