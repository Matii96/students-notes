import { Response, NextFunction } from 'express';
import ISocketAuthorisedUser from '@/interfaces/SocketAuthorised/User';
import IValidationResult from './ValidationResult';

export default interface IValidation {
  Validate(...params: any): Promise<IValidationResult>;
  Rest(req: any, res: Response, next: NextFunction): Promise<void>;
  Socket?(socket: ISocketAuthorisedUser, next: () => void): Promise<void>;
}
