import { Application } from 'express';
import { Server } from 'socket.io';

export default interface IRoute {
  Rest: (express: Application) => Promise<void>;
  Io: (io: Server) => Promise<void>;
  General?: () => Promise<void>;
}
