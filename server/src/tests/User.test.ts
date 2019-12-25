import * as request from 'request';
import IDatatablesRequest from '@/interfaces/Datatables/Request';
import TestAuthorized from './TestAuthorized';

class UserTest extends TestAuthorized {
  private testUserHash: string;

  public constructor() {
    super();
    describe('create', (): void => {
      it('create', this.Create.bind(this));
    });
    describe('getters', (): void => {
      it('list', this.List.bind(this));
      it('settings', this.Settings.bind(this));
      it('login history', this.LoginHistory.bind(this));
    });
    describe('setters', (): void => {
      it('update', this.Update.bind(this));
      it('validation', this.Validation.bind(this));
    });
    describe('delete', (): void => {
      it('delete', this.Delete.bind(this));
    });
  }
  private async Create(): Promise<void> {
    const response: request.Response = await this.api
      .post('users')
      .set('Authorization', this.token)
      .send({ name: 'usertest', password: 'usertest' })
      .expect(200);
    this.testUserHash = response.text;
  }
  private async Update(): Promise<void> {
    await this.api
      .patch(`user/${this.testUserHash}`)
      .set('Authorization', this.token)
      .send({ email: 'test@itm.com.pl' })
      .expect(200);
  }
  private async Validation(): Promise<void> {
    await this.api
      .patch(`user/${this.testUserHash}`)
      .set('Authorization', this.token)
      .send({ name: 'usertest' })
      .expect(400);
  }
  private async Settings(): Promise<void> {
    await this.api
      .get(`user/${this.testUserHash}/settings`)
      .set('Authorization', this.token)
      .expect('Content-Type', /json/)
      .expect(200);
  }
  private async LoginHistory(): Promise<void> {
    const query: IDatatablesRequest = {
      draw: 1,
      start: 0,
      length: 10,
      columns: [{ search: { value: '' } }, { search: { value: '' } }],
      order: [{ column: '1', dir: 'DESC' }],
      search: {
        value: ''
      }
    };
    await this.api
      .get(`user/${this.testUserHash}/login-history`)
      .set('Authorization', this.token)
      .query(query)
      .expect(200);
  }
  private async List(): Promise<void> {
    await this.api
      .get(`users`)
      .set('Authorization', this.token)
      .expect(200);
  }
  private async Delete(): Promise<void> {
    await this.api
      .delete(`user/${this.testUserHash}`)
      .set('Authorization', this.token)
      .expect(200);
  }
}

new UserTest();
