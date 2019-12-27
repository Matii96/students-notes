import { QueryInterface } from 'sequelize';
import ISeeder from '@/interfaces/Seeder';
import { hashSync } from 'bcrypt';
import * as shortid from 'shortid';
import * as config from '@config';

const users: ISeeder = class Users {
  public static async up(queryInterface: QueryInterface): Promise<void> {
    const now: Date = new Date();
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'test',
        hash: shortid.generate(),
        password: hashSync('test', config.authentication.userPasswordSalt),
        email: 'foo@bar.com',
        lang: 'en',
        roleId: 1,
        locked: false,
        createdAt: now,
        updatedAt: now
      }
    ]);
  }
  public static async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('Users', null);
  }
};
export default users;
