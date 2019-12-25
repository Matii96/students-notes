import { Application } from 'express';
import { Server, Namespace } from 'socket.io';
import User from '@/controllers/User';
import Authorization from '@/policies/authorization';
import AccessUser from '@/policies/access/User';
import ValidateUser from '@/policies/validation/User';
import IRoute from '@/interfaces/Router';
import IUser from '@/interfaces/User/User';
import ISocketEditUser from '@/interfaces/User/SocketUser';
import ISocketAuthorised from '@/interfaces/SocketAuthorised/User';

export default class UserRouter implements IRoute {
  public readonly users: { [key: string]: IUser };

  public constructor() {
    this.users = {};
  }

  public async Rest(express: Application): Promise<void> {
    express.get('/api/users', Authorization.User.Rest([1]), User.List);
    express.get('/api/user/:hash/settings', Authorization.User.Rest([1, 2]), AccessUser.Rest, User.Settings);
    express.get('/api/user/:hash/login-history', Authorization.User.Rest([1, 2]), AccessUser.Rest, User.LoginHistory);

    express.post('/api/users', Authorization.User.Rest([1]), ValidateUser.Rest, User.Create);
    express.patch('/api/user/:hash', Authorization.User.Rest([1, 2]), AccessUser.Rest, ValidateUser.Rest, User.Update);
    express.delete('/api/user/:hash', Authorization.User.Rest([1]), AccessUser.Rest, User.Delete);

    // Authentication
    express.post('/api/login', User.Login);
    express.post('/api/resetPassword', User.ResetPassword);
  }
  public async Io(io: Server): Promise<void> {
    const nsp: Namespace = io.of('/api/usersocket');
    nsp.use(Authorization.User.Socket([1, 2]));
    nsp.use(AccessUser.Socket);
    nsp.on('connection', (socket: ISocketEditUser): void => {
      // Join to room of user
      socket.join(socket.editUser.id);

      User.UpdateMeta(socket);

      // Get data about roles and companies
      socket.on(
        'getFormData',
        async (): Promise<void> => {
          socket.emit('getFormData', await User.GetFormData());
        }
      );
    });

    // Socket for list of users
    const nspList: Namespace = io.of('/api/userssocket');
    nsp.use(Authorization.User.Socket([1]));
    nspList.on('connection', (socket: ISocketAuthorised): void => {
      // Get data about roles and companies
      socket.on(
        'getFormData',
        async (): Promise<void> => {
          socket.emit('getFormData', await User.GetFormData());
        }
      );
    });

    // Client is socket for all logged in users
    const nspClient: Namespace = io.of('/api/clientsocket');
    nspClient.use(Authorization.User.Socket([1, 2]));
    nspClient.on(
      'connection',
      async (socket: ISocketAuthorised): Promise<void> => {
        socket.join(socket.user.id);

        // Update user's online status
        User.UpdateState(socket, true);

        socket.on(
          'disconnect',
          async (): Promise<void> => {
            User.UpdateState(socket, false);
          }
        );
      }
    );
  }
}
