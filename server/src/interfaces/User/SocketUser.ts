import SocketAuthorised from '@/interfaces/SocketAuthorised/User';
import User from '@/model/entities/user';

export default interface ISocketEditUser extends SocketAuthorised {
  editUser: User;
}
