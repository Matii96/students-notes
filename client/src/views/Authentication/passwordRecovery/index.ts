import { Component, Vue } from 'vue-property-decorator';
import api from '@/api/Authentication';

@Component
export default class AuthenticationPasswordRecovery extends Vue {
  private username: string;
  private responseType: -1 | 0 | 1 | 2;
  private response: string;

  public constructor() {
    super();
  }

  private async ResetPassword(): Promise<void> {
    if (this.username.length === 0 || this.responseType === 0) {
      return;
    }
    try {
      this.responseType = 0;
      await api.ResetPassword({
        name: this.username
      });
      this.responseType = 1;
    } catch (err) {
      this.responseType = 2;
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
}
