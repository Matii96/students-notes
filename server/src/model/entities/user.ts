import { Model, DataType, Column, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import * as shortid from 'shortid';
import { hashSync, compareSync } from 'bcrypt';
import * as config from '@config';
import Role from '@/model/entities/role';
import IBaseEntity from '@/interfaces/BaseEntity';

@Table
export default class User extends Model<User> implements IBaseEntity {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    set(val: string): void {
      this.setDataValue('name', val.trim());
    }
  })
  public name: string;

  @Column({
    type: DataType.STRING(4096),
    set(val: string): void {
      this.setDataValue('description', val ? val.trim() : val);
    }
  })
  public description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    defaultValue(): string {
      return shortid.generate();
    }
  })
  public hash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(val: string): void {
      this.setDataValue('password', hashSync(val.trim(), config.authentication.userPasswordSalt));
    }
  })
  public password: string;

  @Column({
    type: DataType.STRING,
    set(val: string): void {
      this.setDataValue('email', val ? val.trim() : val);
    }
  })
  public email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'en',
    set(val: string): void {
      this.setDataValue('lang', val.trim());
    }
  })
  public lang: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  public locked: boolean;

  @ForeignKey((): typeof Model => Role)
  @Column
  public roleId: number;

  @BelongsTo((): typeof Model => Role, {
    onDelete: 'SET NULL'
  })
  public role: Role;

  public ComparePassword(password: string): boolean {
    return compareSync(password, this.password);
  }
}
