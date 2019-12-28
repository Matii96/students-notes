import * as path from 'path';
import { Sequelize } from 'sequelize-typescript';
import CustomLogger from '@/services/logger';
import ILogger from '@/interfaces/Logger';
import Model from '@/model';

export default class BaseApp {
  public readonly config: any;
  public readonly rootdir: string;
  public readonly logger: ILogger;
  public readonly model: Sequelize;

  public constructor(config: any) {
    this.config = config;
    this.rootdir = path.resolve(__dirname, '..', '..');

    // Init logger
    this.logger = new CustomLogger(config).logger;

    // Init model
    // Add logger to sequelize
    this.config.development.logging = this.logger.info;
    this.config.test.logging = this.logger.info;
    this.model = new Model(this.config[process.env.NODE_ENV]).sequelize;
  }
}
