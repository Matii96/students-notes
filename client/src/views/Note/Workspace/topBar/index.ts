import { Component, Prop, Vue } from 'vue-property-decorator';
import INoteParticipant from '@/interfaces/Note/workspace/Participant';

@Component
export default class NoteWorkspaceTopBar extends Vue {
  @Prop() private socket!: SocketIOClient.Socket;
  private participants: INoteParticipant[];

  public constructor() {
    super();
    this.participants = [];
  }

  private UpdateParticipants(data: INoteParticipant[]): void {
    if (this.participants.length > 0 && this.participants.length !== data.length) {
      // Find difference between old and new participants list
      let i: number = 0;
      while (true) {
        if (i === this.participants.length || i === data.length || this.participants[i].name !== data[i].name) {
          if (this.participants.length < data.length) {
            this.$notify({
              type: 'info',
              title: this.$t('note').toString(),
              text: `${this.$t('user')} ${data[i].name} ${this.$t('joinedToWorkspace')}`
            });
          } else {
            this.$notify({
              type: 'info',
              title: this.$t('note').toString(),
              text: `${this.$t('user')} ${this.participants[i].name} ${this.$t('leftWorkspace')}`
            });
          }
          break;
        }
        i++;
      }
    }
    this.participants = data;
  }

  private mounted(): void {
    // Data flow control
    this.socket.on('participants', this.UpdateParticipants);
  }

  private destroyed(): void {
    this.socket.off('participants');
  }
}
