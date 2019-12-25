import User from '@/model/entities/user';
import Note from '@/model/entities/note';
import UserNote from '@/model/entities/userNote';
import ISelectedUser from '@/interfaces/Note/SelectedUser';
import ISocketAuthorised from '@/interfaces/SocketAuthorised/User';
import app from '@/app';
import { Op } from 'sequelize';

async function GetSelectedUsers(
  socket: ISocketAuthorised,
  noteHash: string
): Promise<{ users: ISelectedUser[]; selectedUsers: string[] }> {
  try {
    // Get all users
    const usersDb: User[] = await User.findAll({
      attributes: ['hash', 'name'],
      where: {
        hash: {
          [Op.not]: socket.user.hash
        }
      }
    });
    const users: ISelectedUser[] = usersDb.map(
      (user: User): ISelectedUser => {
        return {
          id: user.hash,
          text: user.name
        };
      }
    );

    // Get already selected users
    let selectedUsers: string[] = [];
    if (noteHash) {
      const userNotes: UserNote[] = await UserNote.findAll({
        where: {
          '$note.hash$': noteHash,

          // Exclude user himself
          '$user.hash$': {
            [Op.not]: socket.user.hash
          }
        },
        include: [
          {
            model: User,
            required: true,
            attributes: ['hash']
          },
          {
            model: Note,
            required: true,
            attributes: ['hash']
          }
        ]
      });
      selectedUsers = userNotes.map((userNote: UserNote): string => userNote.user.hash);
    }

    return { users, selectedUsers };
  } catch (err) {
    app.logger.error('An error has occured when trying to get note allowed users list', err);
    return err;
  }
}
export default GetSelectedUsers;
