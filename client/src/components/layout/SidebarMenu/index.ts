import { Component, Vue } from 'vue-property-decorator';
import UserSidebarMenu from '@/policies/UserSidebarMenu';
import ISidebarMenu from '@/interfaces/SidebarMenu';
import main from '@/main';

@Component
export default class SidebarMenu extends Vue {
  private menuTree: ISidebarMenu;

  public constructor() {
    super();
    this.menuTree = UserSidebarMenu(this.$store.state.user);
  }

  private ToggleSidebar(): void {
    if (window.innerWidth <= 767) {
      main.$emit('toggleSidebar');
    }
  }
}
