import * as fs from 'fs';
import * as winston from 'winston';
import * as path from 'path';
import { format } from 'util';
import * as moment from 'moment';
import ILogger from '@/interfaces/Logger';

export default class CustomLogger {
  private dateFormat: string;
  public logger: ILogger;

  public constructor(config: any) {
    this.dateFormat = config.dateFormat;

    // Set paths
    config.logs.filename = path.join(config.logs.directory, config.logs.filename);
    if (!fs.existsSync(config.logs.directory)) {
      fs.mkdirSync(config.logs.directory);
    }

    const logger: winston.Logger = winston.createLogger({
      format: winston.format.combine(winston.format.splat(), this.LogFormat()),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        }),
        new winston.transports.File(config.logs)
      ]
    });

    this.logger = {
      error: this.Wrapper(logger.error),
      warn: this.Wrapper(logger.warn),
      info: this.Wrapper(logger.info),
      verbose: this.Wrapper(logger.verbose),
      debug: this.Wrapper(logger.debug),
      silly: this.Wrapper(logger.silly)
    };
    process.on('unhandledRejection', (err: Error): void => {
      this.logger.error('Unhandled error', err);
    });
  }
  private LogFormat(): any {
    return winston.format.printf((info): string => {
      const levelUppercase: string = (info.level.toUpperCase() + ' '.repeat(7)).slice(0, 7);
      let msg: any = info.message;
      if (Array.isArray(msg)) {
        msg = msg.map((arg: any): string => format(arg)).join(' # ');
      } else {
        msg = format(msg);
      }
      // return `${levelUppercase} ${this.getCurrentDate()}: ${msg}`
      const now: string = moment(new Date()).format(this.dateFormat);
      return `${levelUppercase} ${now}: ${msg}`;
    });
  }
  protected Wrapper(original: any): (...args: any) => any {
    return (...args: any): void => {
      original(args);
    };
  }
}
