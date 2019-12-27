import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import $ from 'jquery';

@Component
export default class NoteWorkspaceEditor extends Vue {
  @Prop() private socket!: SocketIOClient.Socket;
  private synchronized: boolean;
  private content: string;

  public constructor() {
    super();
    this.content = '';
    this.synchronized = false;
  }

  @Watch('content')
  private OnContentChanged(to: string): void {
    if (this.synchronized) {
      this.synchronized = false;
      return;
    }
    this.socket.emit('synchronize', {
      content: to
    });
  }

  private SetContent(content: string): void {
    this.content = content || '';
    this.synchronized = true;
  }

  private mounted(): void {
    // Data flow control
    this.socket.on('initNote', this.SetContent);
    this.socket.on('synchronize', this.SetContent);

    // Complete loading bar
    // @ts-ignore
    this.$Progress.finish();

    $('.editr--content').focus();
  }

  private destroyed(): void {
    this.socket.off('initNote');
    this.socket.off('synchronize');
  }
}
