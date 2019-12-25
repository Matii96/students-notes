import { Model, DataType, Column, Table } from 'sequelize-typescript';

@Table
export default class Role extends Model<Role> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    set(val: string): void {
      this.setDataValue('name', val.trim());
    }
  })
  public name: string;
}
