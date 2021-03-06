export default interface IUserModel {
  name: string;
  description: string;
  hash: string;
  email: string;
  lang: string;
  locked: boolean;
  roleId: number;
}
