import { Op } from 'sequelize';
import { Model, DataType, Column, Table, ForeignKey, BelongsTo, BeforeBulkCreate } from 'sequelize-typescript';
import * as config from '@config';
import User from './user';

@Table
export default class LoginHistory extends Model<LoginHistory> {
  @Column({
    type: DataType.STRING
  })
  public address: string;

  @Column({
    type: DataType.STRING
  })
  public browser: string;

  @Column({
    type: DataType.STRING
  })
  public os: string;

  @ForeignKey((): typeof Model => User)
  @Column
  public userId: number;

  @BelongsTo((): typeof Model => User, {
    onDelete: 'CASCADE'
  })
  public user: User;

  @BeforeBulkCreate
  public static async RemoveOldest(): Promise<void> {
    if (config.storageLimits.userLoginHistory < 0) {
      return;
    }
    const limitDate: Date = new Date();
    limitDate.setMonth(limitDate.getMonth() - config.storageLimits.userLoginHistory);

    await LoginHistory.destroy({
      where: {
        createdAt: {
          [Op.lt]: limitDate
        }
      }
    });
  }
}
