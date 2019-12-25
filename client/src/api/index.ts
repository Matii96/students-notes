import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import IDatatablesRequest from '@/interfaces/Datatables/Request';
import config from '@/config';
import store from '@/store';
import main from '@/main';

class Api {
  public axios: AxiosInstance;

  public constructor() {
    this.axios = axios.create({
      baseURL: config.serverURI
    });
    this.axios.interceptors.request.use(this.RequestHandler);
    this.axios.interceptors.response.use(this.ResponseHandler, this.ErrorHandler);
  }

  private RequestHandler(reqConfig: AxiosRequestConfig): AxiosRequestConfig {
    if (store.state.token) {
      reqConfig.headers = {
        Authorization: `Bearer ${store.state.token.hash}`
      };
    }
    return reqConfig;
  }

  private ResponseHandler(response: AxiosResponse<any>): AxiosResponse<any> {
    return response;
  }

  private ErrorHandler(err: any): void {
    if (err.response.status === 403) {
      main.$emit('logout');
    }
    throw err;
  }

  public DatatablesRequest(url: string): IDatatablesRequest {
    let request: IDatatablesRequest = {
      url: config.serverURI + url,
      type: 'GET'
    };
    if (store.state.token) {
      request.headers = {
        Authorization: `Bearer ${store.state.token.hash}`
      };
    }
    return request;
  }
}

export default new Api();
