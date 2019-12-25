import RequestAuthorised from '@/interfaces/RequestAuthorised/User';
import User from '@/model/entities/user';

export default interface IRequestEditUser extends RequestAuthorised {
  editUser: User;
}
