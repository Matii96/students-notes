import { Component, Vue, Watch } from 'vue-property-decorator';
import $ from 'jquery';
import io from 'socket.io-client';
import { RouteRecord } from 'vue-router';
import localization from '@/localization';

import Sidebar from '@/components/layout/Sidebar/index.vue';
import DashHeader from '@/components/layout/DashHeader/index.vue';
import DashMeta from '@/components/layout/DashMeta/index.vue';
import DashFooter from '@/components/layout/DashFooter/index.vue';
import LoadingOverlay from '@/components/layout/LoadingOverlay.vue';
import IRoute from '@/interfaces/Route';
import IDash from '@/interfaces/Dash';
import config from '@/config';
import main from '@/main';

@Component({
  components: {
    Sidebar,
    DashHeader,
    DashMeta,
    DashFooter,
    LoadingOverlay
  }
})
export default class Dash extends Vue implements IDash {
  private panelMeta: IRoute[];
  private viewportDelimiters: number[];
  private viewport: number;
  private socketsDict: { [key: string]: SocketIOClient.Socket };
  private userSocketConnected: boolean;
  private languageSet: boolean;

  @Watch('$route')
  private OnRouteChange(): void {
    // @ts-ignore
    this.$Progress.start();
  }

  public constructor() {
    super();
    this.panelMeta = [];
    this.viewportDelimiters = [0, 750, 970];

    // 2: desktop
    // 1: tablet
    // 0: phone
    this.viewport = 0;
    this.socketsDict = {
      userSocket: null
    };
    this.userSocketConnected = false;
    this.languageSet = false;
  }

  public SetDashMeta(meta: IRoute[] = []): void {
    // Dash title
    this.panelMeta = meta;

    // Set window title
    document.title = this.$t('serviceName').toString();
    if (meta.length > 0) {
      document.title = `${meta[meta.length - 1].name} - ${document.title}`;
    } else {
      let route: RouteRecord = this.$route.matched[this.$route.matched.length - 1];
      document.title = `${route.meta.displayName ? route.meta.displayName : route.name} - ${document.title}`;
    }
  }
  private OnResize(): void {
    // Get new viewport
    let newViewport: number = 0;
    for (let i = this.viewportDelimiters.length - 1; i >= 0; i--) {
      let delimiter: number = this.viewportDelimiters[i];
      if (window.innerWidth < delimiter) {
        newViewport = i;
        break;
      }
    }

    // Check if viewport has changed
    if (this.viewport !== newViewport) {
      this.viewport = newViewport;
      if (this.viewport === 2) {
        $('body').addClass('sidebar-collapse');
      } else {
        $('body').removeClass('sidebar-collapse');
      }
    }
  }
  private Logout(): void {
    document.title = this.$t('serviceName').toString();
    this.$store.commit('SetUser', null);
    this.$store.commit('SetToken', null);
    this.$router.push('/');
  }

  private async created(): Promise<void> {
    main.$on('logout', this.Logout);

    // Connect to server for the duration of session
    this.socketsDict.userSocket = io(`${config.serverURI}clientsocket`, {
      secure: true,
      transports: ['websocket'],
      query: {
        token: this.$store.state.token.hash
      }
    });
    this.socketsDict.userSocket.on('connect', (): void => {
      this.userSocketConnected = true;
    });
    this.socketsDict.userSocket.on('logout', this.Logout);
    this.socketsDict.userSocket.on('disconnect', (): void => {
      // If user was immediately disconnected then force him to log in again
      if (!this.userSocketConnected) {
        this.Logout();
        return;
      }
      this.userSocketConnected = false;
    });

    // Adjust language for user
    await localization.ChangeLanguage(this.$store.state.user.lang);
    this.languageSet = true;
  }

  private mounted(): void {
    window.addEventListener('resize', this.OnResize);
    this.OnResize();
  }

  private destroyed(): void {
    window.removeEventListener('resize', this.OnResize);
    this.socketsDict.userSocket.disconnect();
  }
}
