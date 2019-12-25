import { join } from 'path';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export default class Model {
  public readonly sequelize: Sequelize;

  public constructor(dBconfig: any) {
    dBconfig.operatorsAliases = Op;
    dBconfig.models = [join(__dirname, 'entities')];
    this.sequelize = new Sequelize(dBconfig);
  }
}
