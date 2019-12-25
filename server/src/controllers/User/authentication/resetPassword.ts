import { Op } from 'sequelize';
import { Request, Response } from 'express';
import * as Shortid from 'shortid';
import { createTransport } from 'nodemailer';
import UserController from '@/controllers/User';
import User from '@/model/entities/user';
import app from '@/app';

async function ResetPassword(this: UserController, req: Request, res: Response): Promise<void> {
  try {
    const user: User = await User.findOne({
      attributes: ['id', 'email'],
      where: {
        [Op.or]: [{ name: req.body.name }, { email: req.body.name }],
        locked: false
      }
    });

    if (!user) {
      res.status(403).send();
      return;
    }

    // Generate new password
    const newPassword = `${Shortid.generate()}${Shortid.generate()}`;
    await User.update(
      {
        password: newPassword
      },
      {
        where: {
          id: user.id
        }
      }
    );

    // Send new password
    const transporter = createTransport(app.config.mailer);
    const mailOptions = {
      from: app.config.mailer.from,
      to: user.email,
      subject: 'Notes - password reset',
      html: `<b>New password:</b> ${newPassword}`
    };
    transporter.sendMail(mailOptions, (err: Error): void => {
      if (err) {
        app.logger.error('Error has occurred:', err);
        res.status(500).send();
        return;
      }
      res.send();
    });
  } catch (err) {
    app.logger.error('An error has occured during resetting user password', err);
    res.status(500).send();
  }
}
export default ResetPassword;
