import { Component, Vue } from 'vue-property-decorator';
import main from '@/main';

@Component
export default class UserMenu extends Vue {
  private Logout(): void {
    main.$emit('logout');
  }
}
