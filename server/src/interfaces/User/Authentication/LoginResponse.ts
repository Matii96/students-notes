import ILoginUser from './LoginUser';
import IToken from './Token';

export default interface ILoginResponse {
  user: ILoginUser;
  token: IToken;
}
