import { Op } from 'sequelize';
import { Request, Response } from 'express';
import UserController from '@/controllers/User';
import User from '@/model/entities/user';
import UserLoginHistory from '@/model/entities/userLoginHistory';
import ILoginResponse from '@/interfaces/User/Authentication/LoginResponse';
import * as Jwt from 'jsonwebtoken';
import app from '@/app';

async function Login(this: UserController, req: Request, res: Response): Promise<void> {
  try {
    const user: User = await User.findOne({
      where: {
        [Op.or]: [{ name: req.body.name }, { email: req.body.name }],
        locked: false
      }
    });

    if (!user) {
      res.status(403).send();
      return;
    }

    if (!user.ComparePassword(req.body.password)) {
      res.status(403).send();
      return;
    }

    await UserLoginHistory.create({
      address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      browser: req.useragent.browser + ' ' + req.useragent.version,
      os: req.useragent.os,
      userId: user.id
    });

    app.io
      .of('/api/usersocket')
      .to(user.id)
      .emit('createHistoryEntry');

    const userData = {
      hash: user.hash,
      name: user.name,
      role: user.roleId,
      lang: user.lang
    };
    const token = Jwt.sign(userData, app.config.authentication.jwtSecret, {
      expiresIn: app.config.authentication.expiresIn
    });

    const response: ILoginResponse = {
      user: userData,
      token: {
        expiresIn: app.config.authentication.expiresIn,
        hash: token
      }
    };
    res.send(response);
  } catch (err) {
    app.logger.error('An error has occured during user logging in', err);
    res.status(500).send();
  }
}
export default Login;
