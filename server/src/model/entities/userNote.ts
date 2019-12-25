import { Model, DataType, Column, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user';
import Note from './note';

@Table
export default class UserNote extends Model<UserNote> {
  @ForeignKey((): typeof Model => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true
  })
  public userId: number;

  @BelongsTo((): typeof Model => User, {
    onDelete: 'CASCADE'
  })
  public user: User;

  @ForeignKey((): typeof Model => Note)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true
  })
  public noteId: number;

  @BelongsTo((): typeof Model => Note, {
    onDelete: 'CASCADE'
  })
  public note: Note;
}
