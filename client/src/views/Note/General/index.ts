import { Component, Prop, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';
import Dash from '@/components/Dash';
import config from '@/config';

@Component
export default class Notes extends Vue {
  @Prop() private socketsDict!: { [key: string]: SocketIOClient.Socket };
  private socket: SocketIOClient.Socket;

  public constructor() {
    super();
    this.socket = null;
  }

  private beforeCreate(): void {
    (this.$parent as Dash).SetDashMeta([
      {
        name: this.$t('notes').toString()
      }
    ]);
  }

  private created(): void {
    // Connect to notes socket
    let socket: SocketIOClient.Socket = io(config.serverURI + 'notessocket', {
      secure: true,
      transports: ['websocket'],
      query: {
        token: this.$store.state.token.hash
      }
    });

    // Load router view after connection to server
    socket.on('connect', (): void => {
      // Add socket to dash list
      this.socketsDict.notes = socket;

      // Forward to route view
      socket.off('connect');
      socket.off('disconnect');
      this.socket = socket;
    });
    socket.on('disconnect', (): void => {
      // @ts-ignore
      this.$Progress.fail();
      this.$router.push('/');
    });
  }

  private destroyed(): void {
    if (this.socket) {
      this.socket.disconnect();
      delete this.socketsDict.notes;
    }
  }
}
