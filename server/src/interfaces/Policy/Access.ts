import { Response, NextFunction } from 'express';
import User from '@/model/entities/user';
import ISocketAuthorisedUser from '@/interfaces/SocketAuthorised/User';

export default interface IAccess {
  CheckAccess(hash: string, user: User): Promise<any>;
  Rest(req: any, res: Response, next: NextFunction): Promise<void>;
  Socket?(socket: ISocketAuthorisedUser, next: () => void): Promise<void>;
}
