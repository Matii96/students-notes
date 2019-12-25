import BaseApp from '@/app/main';
import IApp from '@/interfaces/App';

export default class Command extends BaseApp implements IApp {
  public readonly args: string[];

  public constructor(config: any) {
    super(config);
    this.args = process.argv.length > 3 ? process.argv.slice(3) : null;
  }

  public async Init(): Promise<void> {
    // Run command
    this.RunCommand(process.argv[2]);
  }
  private async RunCommand(command: string): Promise<void> {
    try {
      switch (command) {
        case 'db:create':
          await this.model.sync({ force: false });
          break;
        default:
          throw new Error(`Invalid command ${command}`);
      }
    } catch (err) {
      this.logger.error(`Command ${process.argv[2]} returned error`, err);
    }
  }
}
