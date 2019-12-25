import { Transaction } from 'sequelize';
import User from '@/model/entities/user';
import UserNote from '@/model/entities/userNote';

async function AllowUsers(
  noteId: number,
  usersHashes: string[],
  t: Transaction
): Promise<{
  removedUsers: number[];
  addedUsers: number[];
  leftUsers: number[];
}> {
  return new Promise(
    async (resolve, reject): Promise<void> => {
      try {
        const removedUsers: number[] = [];
        const addedUsers: number[] = [];
        const leftUsers: number[] = [];

        // Get new owners
        const users: User[] = await User.findAll({
          attributes: ['id', 'hash'],
          where: {
            hash: usersHashes
          },
          transaction: t
        });
        const usersDict: { [hash: string]: number } = {};
        for (const user of users) {
          usersDict[user.hash] = user.id;
        }
        const newOwners: number[] = Object.values(usersDict);

        // Get current owners
        const userNotes: UserNote[] = await UserNote.findAll({
          attributes: ['userId'],
          where: { noteId }
        });
        const currentOwners: number[] = userNotes.map((userNote: UserNote): number => userNote.userId);

        // Compare owners

        // Remove old relations
        if (userNotes.length > 0) {
          await UserNote.destroy({
            where: {
              noteId: noteId
            },
            transaction: t
          });
        }

        // Create new
        const newUserNotes = usersHashes.map((userHash: string) => {
          return {
            userId: usersDict[userHash],
            noteId: noteId as number
          };
        });

        await UserNote.bulkCreate(newUserNotes, {
          transaction: t
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    }
  );
}
export default AllowUsers;
