import { AxiosResponse } from 'axios';
import INoteForm from '@/interfaces/Note/Form';
import api from '.';

export default class NoteApi {
  public static Create(data: INoteForm): Promise<AxiosResponse<string>> {
    return api.axios.post('notes', data);
  }
  public static Update(hash: string, data: INoteForm): Promise<AxiosResponse<void>> {
    return api.axios.patch(`note/${hash}`, data);
  }
  public static Remove(hash: string): Promise<AxiosResponse<void>> {
    return api.axios.delete(`note/${hash}`);
  }
  public static List(): Promise<AxiosResponse<[string, string, string, Date][]>> {
    return api.axios.get('notes');
  }
}
