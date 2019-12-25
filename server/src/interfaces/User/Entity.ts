export default interface IUserEntity {
  name: string;
  description: string;
  email: string;
  lang: string;
  role?: number;
  locked?: boolean;
}
