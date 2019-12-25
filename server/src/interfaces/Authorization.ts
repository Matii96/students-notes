import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';

export default interface IAuthorization {
  Rest(roles: number[]): (req: Request, res: Response, next: NextFunction) => void;
  Socket?(roles: number[]): (socket: Socket, next: () => void) => void;
}
