import { Component, Prop, Vue } from 'vue-property-decorator';
import Editor from './editor/index.vue';
import TopBar from './topBar/index.vue';
import main from '@/main';

@Component({
  components: {
    Editor,
    TopBar
  }
})
export default class NoteWorkspace extends Vue {
  @Prop() private socket!: SocketIOClient.Socket;

  private mounted(): void {
    // State control
    this.socket.on('connect', (): void => {
      this.socket.emit('joinWorkspace');
    });

    // Get current state of note
    this.socket.emit('joinWorkspace');
  }

  private destroyed(): void {
    this.socket.off('connect');
    this.socket.off('updateVersions');
    this.socket.emit('leaveWorkspace');
  }
}
