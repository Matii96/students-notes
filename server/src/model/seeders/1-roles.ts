import { QueryInterface } from 'sequelize';
import ISeeder from '@/interfaces/Seeder';

const roles: ISeeder = class Roles {
  public static async up(queryInterface: QueryInterface): Promise<void> {
    const now: Date = new Date();
    await queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        name: 'Administrator',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Client',
        createdAt: now,
        updatedAt: now
      }
    ]);
  }
  public static async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('Roles', null);
  }
};
export default roles;
