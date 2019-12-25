import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Joi from 'joi-browser';
import $ from 'jquery';
import INoteForm from '@/interfaces/Note/Form';
import ISelectedUser from '@/interfaces/Note/SelectedUser';
import Select2 from 'v-select2-component';
import api from '@/api/Note';

type row = [string, string, string, Date];

@Component({
  components: {
    Select2
  }
})
export default class NoteDataform extends Vue {
  @Prop() private socket!: SocketIOClient.Socket;
  @Prop() private selectedRow!: number;
  @Prop() private notes!: row[];
  private name: string;
  private users: ISelectedUser[];
  private selectedUsers: string[];

  public constructor() {
    super();
    this.name = '';
    this.selectedUsers = ['######'];
    this.users = [];
  }

  private get submitData(): INoteForm {
    return {
      note: {
        name: this.name
      },
      allowedUsers: this.selectedUsers
    };
  }

  @Watch('selectedRow')
  private OnSelectedRowChanged(to: number): void {
    if (to === null) {
      this.name = '';
      this.socket.emit('getUsersList', null);
    } else {
      this.name = this.notes[to][1];
      this.socket.emit('getUsersList', this.notes[to][0]);
    }
  }

  private get usedNames() {
    let names: string[] = this.notes.map((note: row): string => note[1]);
    if (this.selectedRow !== null && this.notes[this.selectedRow]) {
      names.splice(names.indexOf(this.notes[this.selectedRow][1]), 1);
    }
    return names;
  }

  private get errors(): { [key: string]: string } {
    let result = Joi.validate(
      this.submitData.note,
      Joi.object().keys({
        name: Joi.string()
          .min(2)
          .max(100)
          .invalid(this.usedNames)
          .error(() => {
            return {
              message: this.$t('nameValidation')
            };
          })
      }),
      {
        abortEarly: false
      }
    );

    // Errors handling
    let errors: { [key: string]: string } = {};
    if (result.error) {
      for (let error of result.error.details) {
        errors[error.context.key] = error.message;
      }
    }
    return errors;
  }

  private get readyToSubmit(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  private async Submit(): Promise<void> {
    if (!this.readyToSubmit) {
      return;
    }
    try {
      if (this.selectedRow === null) {
        let hash: string = (await api.Create(this.submitData)).data;
        this.$router.push(`/note/${hash}`);
      } else {
        await api.Update(this.notes[this.selectedRow][0], this.submitData);
      }
    } catch (err) {
      this.$notify({
        type: 'error',
        title: this.$t('notes').toString(),
        text: err
      });
    } finally {
      $('#noteModal').modal('hide');
      $('[data-dismiss=modal]').trigger('click');
    }
  }

  private async Delete(): Promise<void> {
    try {
      if (!confirm(this.$t('confirmAsk').toString())) {
        return;
      }
      await api.Remove(this.notes[this.selectedRow][0]);
    } catch (err) {
      this.$notify({
        type: 'error',
        title: this.$t('notes').toString(),
        text: err
      });
    } finally {
      $('#noteModal').modal('hide');
      $('[data-dismiss=modal]').trigger('click');
    }
  }

  private mounted(): void {
    $('#noteModal').on('shown.bs.modal', (): void => {
      (this.$refs.name as HTMLInputElement).focus();
    });

    this.socket.on('setUsersList', (data: { users: ISelectedUser[]; selectedUsers: string[] }): void => {
      this.users = data.users;
      this.selectedUsers = data.selectedUsers;
    });
    this.socket.emit('getUsersList', null);
  }

  private destroyed(): void {
    this.socket.off('setUsersList');
  }
}
