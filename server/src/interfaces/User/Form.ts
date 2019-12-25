import User from '@/model/entities/user';

export default interface IUserForm extends Omit<User, 'company'> {
  company: string; // Hash
  currentPassword: string;
}
