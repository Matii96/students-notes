import * as Joi from '@hapi/joi';
import { Op } from 'sequelize';
import { ObjectSchema, ValidationResult } from 'joi';
import { Response, NextFunction } from 'express';
import * as xss from 'xss-filters';
import User from '@/model/entities/user';
import Note from '@/model/entities/note';
import INoteForm from '@/interfaces/Note/Form';
import IValidation from '@/interfaces/Policy/Validation';
import IValidationResult from '@/interfaces/Policy/ValidationResult';
import IRequestNote from '@/interfaces/Note/RequestNote';
import app from '@/app';

/*
Codes:
0: Invalid data
1: colliding name
*/

const NoteValidation: IValidation = class UserValidation {
  public static async Validate(user: User, note: Note, data: INoteForm): Promise<IValidationResult> {
    const schema: ObjectSchema = Joi.object().keys({
      note: Joi.object().keys({
        name: Joi.string()
          .min(2)
          .max(100),
        content: Joi.string()
          .allow(null)
          .max(4096)
      }),
      allowedUsers: Joi.array().allow(null)
    });

    try {
      const result: ValidationResult<INoteForm> = Joi.validate(data, schema);
      if (result.error) {
        app.logger.warn('Invalid note data', result.error);
        return {
          error: 400,
          code: 0
        };
      }

      // Prevents XSS
      if (data.note.name) {
        data.note.name = xss.inHTMLData(data.note.name);
      }
      if (data.note.content) {
        data.note.content = xss.inHTMLData(data.note.content);
      }

      // If name is present then check uniqueness
      if (data.note.name) {
        const collidingNote: Note = await Note.findOne({
          attributes: ['name'],
          where: {
            id: {
              [Op.not]: note ? note.id : -1
            },
            name: data.note.name
          }
        });
        if (collidingNote) {
          app.logger.warn('Invalid note data', 'note with given name already exists');
          return {
            error: 400,
            code: 1
          };
        }
      }
    } catch (err) {
      app.logger.error('An error has occured when trying to validate note', err);
      return {
        error: 400,
        code: -1
      };
    }
  }
  public static async Rest(req: IRequestNote, res: Response, next: NextFunction): Promise<void> {
    const result: IValidationResult = await UserValidation.Validate(req.user, req.note, req.body);
    if (result) {
      res.status(result.error).send({
        code: result.code
      });
      return;
    }

    // Prevents XSS
    req.body = JSON.parse(xss.inHTMLData(JSON.stringify(req.body))) as INoteForm;
    next();
  }
};
export default NoteValidation;
