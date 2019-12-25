import * as config from '../../config';
import * as supertest from 'supertest';

export default class Test {
  protected readonly config: any;
  protected readonly api: supertest.SuperTest<supertest.Test>;

  public constructor() {
    this.config = config;
    this.api = supertest.agent(`${config.protocol}://localhost:${config.port}/api/`);
  }
}
