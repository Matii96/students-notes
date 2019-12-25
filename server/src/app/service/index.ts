import * as fs from 'fs';
import * as path from 'path';
import * as Express from 'express';
import * as Cors from 'cors';
import * as BodyParser from 'body-parser';
import * as Useragent from 'express-useragent';
import * as Socketio from 'socket.io';
import * as Http from 'http';
import * as Https from 'https';
import * as Morgan from 'morgan';
import ServerInitializer from './server';
import Listen from './listen';
import BaseApp from '@/app/main';
import Router from '@/router';
import IApp from '@/interfaces/App';
import ILogger from '@/interfaces/Logger';

export default class Service extends BaseApp implements IApp {
  public readonly express: Express.Application;
  public io: Socketio.Server;
  public router: Router;
  protected server: Http.Server | Https.Server;

  public constructor(config: any) {
    super(config);

    // Init express
    this.express = Express();
    this.express.use(BodyParser.json(this.config.bodyParser));
    this.express.use(BodyParser.urlencoded(this.config.bodyParser));
    this.express.use(Useragent.express());
    this.express.use(Cors());

    // Add morgan middleware to express
    const logger: ILogger = this.logger;
    this.express.use(
      Morgan(':remote-addr :method :url :status :user-agent', {
        stream: {
          write(msg: string): void {
            logger.info(msg.slice(0, -1));
          }
        }
      })
    );
  }

  public async Init(): Promise<void> {
    // Connect to database
    await this.model.authenticate();

    // Create http / https server
    this.server = await this.ServerInitializer();

    // Setting sockets
    this.io = Socketio.listen(this.server);

    // Init router
    this.router = new Router(this.express, this.io);
    await this.router.Init();

    // Load client
    const clientDist: string = path.resolve(this.rootdir, '..', 'client', 'dist');
    if (fs.existsSync(clientDist)) {
      this.express.use(Express.static(clientDist));
      this.express.get('*', (req: Express.Request, res: Express.Response): void => {
        res.sendFile(path.join(clientDist, 'index.html'));
      });
      this.logger.info('Client loaded');
    }

    // Run server
    this.Listen();
  }

  private ServerInitializer = ServerInitializer;
  private Listen = Listen;
}
