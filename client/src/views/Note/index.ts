import { Component, Prop, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';
import IBaseEntity from '@/interfaces/BaseEntity';
import IDash from '@/interfaces/Dash';
import config from '@/config';

@Component
export default class Note extends Vue {
  @Prop() private socketsDict!: { [key: string]: SocketIOClient.Socket };
  private socket: SocketIOClient.Socket;

  public constructor() {
    super();
    this.socket = null;
  }

  private UpdateMeta(data: IBaseEntity): void {
    (this.$parent as Vue & IDash).SetDashMeta([
      {
        name: `${this.$t('note')} ${data[0].name}`,
        path: `/note/${this.$route.params.hash}`
      }
    ]);
  }

  private RemoveNote(): void {
    this.$notify({
      type: 'warning',
      title: this.$t('note').toString(),
      text: this.$t('noteRemoved').toString()
    });
    this.$router.push('/');
  }

  private beforeCreate(): void {
    (this.$parent as Vue & IDash).SetDashMeta([
      {
        name: this.$t('company').toString()
      },
      {
        name: this.$t('note').toString(),
        path: `/note/${this.$route.params.hash}`
      }
    ]);
  }

  private created(): void {
    // Connect to company socket
    let socket: SocketIOClient.Socket = io(config.serverURI + 'notesocket', {
      secure: true,
      transports: ['websocket'],
      query: {
        hash: this.$route.params.hash,
        token: this.$store.state.token.hash
      }
    });

    // Events for note
    socket.on('updateMeta', this.UpdateMeta);
    socket.on('removeNote', this.RemoveNote);

    // Load router view after connection to server
    socket.on('connect', (): void => {
      // Add socket to dash list
      this.socketsDict.note = socket;

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
      delete this.socketsDict.note;
    }
  }
}
