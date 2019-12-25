import { QueryInterface, Sequelize } from 'sequelize';

export default interface Seeder {
  up: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
  down: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
}
