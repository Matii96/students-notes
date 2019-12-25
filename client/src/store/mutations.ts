import { MutationTree } from 'vuex';
import ILoginResponse from '@/interfaces/Authentication/LoginResponse';
import ILoginUser from '@/interfaces/Authentication/LoginUser';
import IToken from '@/interfaces/Authentication/Token';

const mutations: MutationTree<ILoginResponse> = {
  SetUser(state: ILoginResponse, user: ILoginUser): void {
    state.user = user;
  },
  ChangeUserLang(state: ILoginResponse, lang: string): void {
    state.user.lang = lang;
  },
  SetToken(state: ILoginResponse, token: IToken): void {
    state.token = token;
  }
};
export default mutations;
