import { AxiosResponse } from 'axios';
import IUserEntity from '@/interfaces/User/Entity';
import IDatatablesRequest from '@/interfaces/Datatables/Request';
import api from '.';

export default class UserApi {
  public static Details(hash: string): Promise<AxiosResponse<IUserEntity>> {
    return api.axios.get(`user/${hash}/settings`);
  }
  public static Create(data: IUserEntity): Promise<AxiosResponse<string>> {
    return api.axios.post('users', data);
  }
  public static Update(hash: string, data: IUserEntity): Promise<AxiosResponse<any>> {
    return api.axios.patch(`user/${hash}`, data);
  }
  public static Remove(hash: string): Promise<AxiosResponse<any>> {
    return api.axios.delete(`user/${hash}`);
  }
  public static List(): Promise<AxiosResponse<[string, string, string][]>> {
    return api.axios.get('users');
  }
  public static LoginHistory(hash: string): IDatatablesRequest {
    return api.DatatablesRequest(`user/${hash}/login-history`);
  }
}
