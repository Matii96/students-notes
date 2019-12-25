import { Request } from 'express';
import User from '@/model/entities/user';

export default interface RequestUser extends Request {
  user: User;
}
