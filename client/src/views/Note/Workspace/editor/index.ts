import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class NoteWorkspaceEditor extends Vue {
  @Prop() private socket!: SocketIOClient.Socket;
  private content: string;

  public constructor() {
    super();
    this.content = '';
  }

  private mounted(): void {
    // Data flow control
    this.socket.on('initNote', (content: string): void => {
      this.content = content;
    });
    this.socket.on('synchronize', (content: string): void => {
      this.content = content;
    });
  }

  private destroyed(): void {
    this.socket.off('initNote');
    this.socket.off('synchronize');
  }
}
