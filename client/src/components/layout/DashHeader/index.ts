import { Component, Vue, Prop } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { ResizeObserver } from 'resize-observer';
import UserMenu from '@/components/layout/UserMenu/index.vue';
import main from '@/main';

@Component({
  components: {
    UserMenu
  }
})
export default class DashHeader extends Vue {
  private sidebarCollapsed: boolean;
  private logoObserver: ResizeObserver;
  @Prop()
  private panelMeta!: Route[];

  public constructor() {
    super();
    this.sidebarCollapsed = true;
    // @ts-ignore
    this.logoObserver = new window.ResizeObserver((): void => {
      this.OnResize();
    });
  }

  private OnResize(): void {
    if (this.$refs.logo) {
      // @ts-ignore
      this.sidebarCollapsed = this.$refs.logo.clientWidth <= 140;
    }
  }

  private created(): void {
    main.$on('toggleSidebar', (): void => {
      // @ts-ignore
      this.$refs.sidebarToggle.click();
    });
  }

  private mounted(): void {
    // @ts-ignore
    this.logoObserver.observe(document.getElementById('dashLogo'));
  }

  private destroyed(): void {
    this.logoObserver.disconnect();
  }
}
