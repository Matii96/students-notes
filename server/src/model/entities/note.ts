import { Model, DataType, Column, Table } from 'sequelize-typescript';
import * as shortid from 'shortid';
import IBaseEntity from '@/interfaces/BaseEntity';
import INoteEntity from '@/interfaces/Note/Entity';

@Table
export default class Note extends Model<Note> implements IBaseEntity, INoteEntity {
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
      this.setDataValue('content', val ? val.trim() : val);
    }
  })
  public content: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    defaultValue(): string {
      return shortid.generate();
    }
  })
  public hash: string;
}
