import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Login from './login/index.vue';
import PasswordRecovery from './passwordRecovery/index.vue';

@Component({
  components: {
    Login,
    PasswordRecovery
  }
})
export default class Authentication extends Vue {
  private passwordRecovery: boolean;

  public constructor() {
    super();
    this.passwordRecovery = false;
  }
}
