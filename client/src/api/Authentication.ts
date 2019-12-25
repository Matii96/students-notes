import { AxiosResponse } from 'axios';
import ILoginCredentials from '@/interfaces/User/LoginCredentials';
import api from '.';

export default class AuthenticationApi {
  public static Login(credentials: ILoginCredentials): Promise<AxiosResponse<any>> {
    return api.axios.post('login', credentials);
  }
  public static ResetPassword(credentials: ILoginCredentials): Promise<AxiosResponse<any>> {
    return api.axios.post('resetPassword', credentials);
  }
}
