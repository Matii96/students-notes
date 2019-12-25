import { Application } from 'express';
import { Server } from 'socket.io';
import IRoute from '@/interfaces/Router';

import UserRouter from './User';
import NoteRouter from './Note';

export default class Router {
  private readonly express: Application;
  private readonly io: Server;

  // Routers
  public user: UserRouter;
  public note: NoteRouter;

  public constructor(express: Application, io: Server) {
    this.express = express;
    this.io = io;
  }
  public async Init(): Promise<void> {
    const routes: IRoute[] = [];

    // Load routes
    this.user = new (await import('./User')).default();
    this.note = new (await import('./Note')).default();
    routes.push(this.user);
    routes.push(this.note);

    // Init servers
    for (const router of routes) {
      // Init express and socket
      if (router.Rest) {
        await router.Rest(this.express);
      }
      if (router.Io) {
        await router.Io(this.io);
      }
      if (router.General) {
        await router.General();
      }
    }
  }
}
