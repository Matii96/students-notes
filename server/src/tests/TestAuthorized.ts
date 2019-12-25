import * as request from 'request';
import Test from '.';

export default class TestAuthorized extends Test {
  protected token: string;

  public constructor() {
    super();
    beforeAll(this.Login.bind(this));
  }

  private async Login(): Promise<void> {
    const response: request.Response = await this.api.post('login').send({ name: 'mat', password: 'mat96' });
    this.token = `Bearer ${response.body.token.token}`;
  }
}
