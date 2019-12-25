import { Component, Vue } from 'vue-property-decorator';
import ILoginResponse from '@/interfaces/Authentication/LoginResponse';
import { Dictionary } from 'vue-router/types/router';
import { AxiosResponse } from 'axios';
import api from '@/api/Authentication';

@Component
export default class AuthenticationLogin extends Vue {
  private username: string;
  private password: string;
  private response: string;
  private sending: boolean;

  public constructor() {
    super();
    this.username = '';
    this.password = '';
    this.response = null;
    this.sending = false;
  }

  private async CheckCreds(): Promise<void> {
    if (this.username.length === 0 || this.password.length === 0 || this.sending) {
      return;
    }
    this.response = '';

    try {
      this.sending = true;
      let response: AxiosResponse<ILoginResponse> = await api.Login({
        name: this.username,
        password: this.password
      });
      this.sending = false;
      let expiresIn: Date = new Date();
      expiresIn.setSeconds(expiresIn.getSeconds() + response.data.token.expiresIn);
      this.$store.commit('SetUser', response.data.user);
      this.$store.commit('SetToken', {
        hash: response.data.token.hash,
        expiresIn: expiresIn.getTime(),
        expiresInDate: expiresIn
      });
      this.$router.push((this.$route.query as Dictionary<string>).redirect || '/');
    } catch (err) {
      this.sending = false;
      if (err.response === undefined) {
        this.response = this.$t('serviceOffline').toString();
      } else {
        switch (err.response.status) {
          case 403:
            this.response = this.$t('invalidCredentials').toString();
            break;
          case 500:
            this.response = this.$t('interalError').toString();
            break;
          default:
            this.response = `${this.$t('errorCode')}: ${err.response.status}`;
            break;
        }
      }
      (this.$refs.username as HTMLInputElement).focus();
    }
  }
  private mounted(): void {
    (this.$refs.username as HTMLInputElement).focus();
  }
}
