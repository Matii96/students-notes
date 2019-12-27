import * as Joi from '@hapi/joi';
import { ObjectSchema, ValidationResult } from 'joi';
import { Response, NextFunction } from 'express';
import * as xss from 'xss-filters';
import User from '@/model/entities/user';
import IValidation from '@/interfaces/Policy/Validation';
import IValidationResult from '@/interfaces/Policy/ValidationResult';
import IUserForm from '@/interfaces/User/Form';
import IRequestEditUser from '@/interfaces/User/RequestUser';
import app from '@/app';

/*
Codes:
0: Invalid data
1: invalid current password (only self edit)
2: colliding name
*/

const UserValidation: IValidation = class UserValidation {
  public static async Validate(user: User, editUser: User, userData: IUserForm): Promise<IValidationResult> {
    const schemaSelf: ObjectSchema = Joi.object().keys({
      name: Joi.string()
        .min(2)
        .max(100),
      description: Joi.string()
        .allow(null)
        .max(4096),
      email: Joi.string()
        .email()
        .allow(null)
        .max(255),
      lang: Joi.string()
        .allow(null)
        .max(255),
      password: Joi.string().max(255),
      currentPassword: Joi.string()
        .min(2)
        .max(255)
    });
    const schemaOther: ObjectSchema = Joi.object().keys({
      name: Joi.string()
        .min(2)
        .max(100),
      description: Joi.string()
        .allow(null)
        .max(4096),
      email: Joi.string()
        .email()
        .allow(null)
        .max(255),
      lang: Joi.string()
        .allow(null)
        .max(255),
      roleId: Joi.number()
        .integer()
        .min(1),
      locked: Joi.boolean(),
      password: Joi.string()
        .min(2)
        .max(255)
    });

    try {
      const selfEdit: boolean = editUser && user.hash === editUser.hash;
      const result: ValidationResult<IUserForm> = Joi.validate(userData, selfEdit ? schemaSelf : schemaOther);
      if (result.error) {
        app.logger.warn('Invalid user data', user.hash, result.error);
        return {
          error: 400,
          code: 0
        };
      }

      // If user is editing himself then check current password
      if (
        selfEdit &&
        userData.currentPassword &&
        userData.password &&
        !user.ComparePassword(userData.currentPassword)
      ) {
        return {
          error: 400,
          code: 1
        };
      }

      // If name is present then check uniqueness
      if (userData.name) {
        const collidingUser: User = await User.findOne({
          attributes: ['id'],
          where: {
            name: userData.name
          }
        });
        if (collidingUser) {
          app.logger.warn('Invalid user data', user.hash, 'user with given name already exists');
          return {
            error: 400,
            code: 2
          };
        }
      }
    } catch (err) {
      app.logger.error('An error has occured when trying to validate user', user.hash, err);
      return {
        error: 500,
        code: -1
      };
    }
  }
  public static async Rest(req: IRequestEditUser, res: Response, next: NextFunction): Promise<void> {
    const result: IValidationResult = await UserValidation.Validate(req.user, req.editUser, req.body);
    if (result) {
      res.status(result.error).send({
        code: result.code
      });
      return;
    }

    // Prevents XSS
    req.body = JSON.parse(xss.inHTMLData(JSON.stringify(req.body))) as IUserForm;
    next();
  }
};
export default UserValidation;
