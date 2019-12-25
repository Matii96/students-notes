import * as Passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import IRequestAuthorisedUser from '@/interfaces/RequestAuthorised/User';
import ISocketAuthorisedUser from '@/interfaces/SocketAuthorised/User';
import IAuthorization from '@/interfaces/Authorization';
import ILoginUser from '@/interfaces/User/Authentication/LoginUser';
import User from '@/model/entities/user';
import app from '@/app';

export default class UserAuthorization implements IAuthorization {
  public constructor() {
    Passport.use(
      'userRest',
      new Strategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: app.config.authentication.jwtSecret
        },
        this.Verify
      )
    );
  }

  private async Verify(jwtPayload: ILoginUser, done: (err: Error, user: User) => void): Promise<void> {
    try {
      const user: User = await User.findOne({
        where: {
          hash: jwtPayload.hash,
          locked: false
        }
      });
      if (!user) {
        app.logger.warn("Could't authenticate user", 'Unauthorized access', jwtPayload);
        done(new Error('Unauthorized access'), null);
        return;
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
  public Rest(roles: number[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: IRequestAuthorisedUser, res: Response, next: NextFunction): void => {
      Passport.authenticate(
        'userRest',
        async (err: Error, user: User): Promise<void> => {
          if (err) {
            res.status(403).send();
            return;
          }
          if (!user) {
            app.logger.warn('Non-logged in user');
            res.status(403).send();
            return;
          }
          if (roles.indexOf(user.roleId) === -1) {
            app.logger.warn(`Invalid access level for user ${user.id}`);
            res.status(403).send();
            return;
          }
          req.user = user;
          next();
        }
      )(req, res, next);
    };
  }
  public Socket(roles: number[]): (socket: ISocketAuthorisedUser, next: () => void) => void {
    return (socket: ISocketAuthorisedUser, next: () => void): void => {
      const strategy: Strategy = new Strategy(
        {
          jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
          secretOrKey: app.config.authentication.jwtSecret
        },
        this.Verify
      );

      strategy.success = (user: User): void => {
        if (roles.indexOf(user.roleId) === -1) {
          app.logger.warn(`Invalid access level for user ${user.id}`);
          socket.disconnect();
          return;
        }
        socket.user = user;
        next();
      };
      strategy.fail = (): void => {
        socket.disconnect();
        app.logger.warn('Unauthorized socket', socket);
      };
      strategy.error = (err: Error): void => {
        socket.disconnect();
        app.logger.warn('An error occurred during socket authorization', err);
      };
      strategy.authenticate(socket.request, {});
    };
  }
}
