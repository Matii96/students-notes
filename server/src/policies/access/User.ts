import { Response, NextFunction } from 'express';
import User from '@/model/entities/user';
import IAccess from '@/interfaces/Policy/Access';
import IRequestEditUser from '@/interfaces/User/RequestUser';
import ISocketEditUser from '@/interfaces/User/SocketUser';
import app from '@/app';

const UserAccess: IAccess = class UserAccess {
  public static async CheckAccess(hash: string, user: User): Promise<number | User> {
    try {
      if (!(user.hash === hash || user.roleId === 1)) {
        return 403;
      }
      const editUser: User = await User.findOne({
        where: {
          hash
        }
      });
      if (editUser === null) {
        return 404;
      }
      return editUser;
    } catch (err) {
      app.logger.error('An error has occured when trying to access user panel', user.hash, err);
      return 500;
    }
  }
  public static async Rest(req: IRequestEditUser, res: Response, next: NextFunction): Promise<void> {
    const result: number | User = await UserAccess.CheckAccess(req.params.hash, req.user);
    if (typeof result === 'number') {
      res.status(result).send();
      return;
    }
    req.editUser = result;
    next();
  }
  public static async Socket(socket: ISocketEditUser, next: () => void): Promise<void> {
    const result: number | User = await UserAccess.CheckAccess(socket.handshake.query.hash, socket.user);
    if (typeof result === 'number') {
      socket.disconnect();
      return;
    }
    socket.editUser = result;
    next();
  }
};
export default UserAccess;
