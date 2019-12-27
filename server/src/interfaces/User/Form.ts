import User from '@/model/entities/user';

export default interface IUserForm extends User {
  currentPassword: string;
}
