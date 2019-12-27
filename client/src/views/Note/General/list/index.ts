import { Component, Prop, Vue } from 'vue-property-decorator';
import $ from 'jquery';
import { AxiosResponse } from 'axios';
import api from '@/api/Note';
import moment from 'moment';
import Dataform from '@/views/Note/Dataform/index.vue';
import INoteEntity from '@/interfaces/Note/Entity';
import config from '@/config';

type row = [string, string, string, Date];

@Component({
  components: {
    Dataform
  }
})
export default class NotesList extends Vue {
  @Prop() private socket!: SocketIOClient.Socket;
  private headers: string[];
  private notes: row[];
  private notesTable: DataTables.Api;
  private selectedRow: number;

  public constructor() {
    super();
    this.headers = ['hash', 'name', 'updatedAt'];
    this.notes = [];
    this.notesTable = null;
    this.selectedRow = null;
  }

  private GetNoteID(hash: string): number {
    for (let noteRowId in this.notes) {
      if (this.notes[noteRowId][0] === hash) {
        return parseInt(noteRowId);
      }
    }
    return null;
  }

  private async GetList(): Promise<void> {
    // @ts-ignore
    this.$Progress.start();
    try {
      let response: AxiosResponse<row[]> = await api.List();
      this.notes = response.data;

      // Replace content with new data
      if (this.notesTable) {
        this.notesTable.clear();
        this.notesTable.rows.add(this.notes);
        this.notesTable.draw(false);
      }

      // Complete loading bar
      // @ts-ignore
      this.$Progress.finish();
    } catch (err) {
      this.$notify({
        type: 'error',
        title: this.$t('notes').toString(),
        text: err
      });

      // Complete loading bar
      // @ts-ignore
      this.$Progress.fail();
    }
  }

  private CreateNote(row: row): void {
    this.$set(this.notes, this.notes.length, row);
    this.notesTable.row.add(row);
    this.notesTable.draw(false);
  }

  private UpdateNote(rows: INoteEntity[]): void {
    let updated: boolean = false;
    for (let row of rows) {
      let noteRowID: number = this.GetNoteID(row.hash);
      if (!this.notes[noteRowID]) {
        continue;
      }
      for (let cellName in row) {
        let idx: number = this.headers.indexOf(cellName);
        if (this.notes[noteRowID][idx] === row[cellName]) {
          continue;
        }
        this.$set(this.notes[noteRowID], idx, row[cellName]);
        updated = true;
      }
      if (updated) {
        this.notesTable.row(noteRowID).data(this.notes[noteRowID]);
      }
    }
    if (updated) {
      this.notesTable.draw(false);
    }
  }

  private RemoveNote(hash: string): void {
    let noteRowID: number = this.GetNoteID(hash);
    this.$delete(this.notes, noteRowID);
    this.notesTable.clear();
    this.notesTable.rows.add(this.notes);
    this.notesTable.draw(false);
  }

  private InitList(): void {
    let component: NotesList = this;
    try {
      // Inject datatable
      this.notesTable = $('#notesTable').DataTable({
        data: this.notes,
        pageLength: 10,
        dom: config.datatables.btnNewDom,
        order: [[2, 'desc']],
        // @ts-ignore
        buttons: [
          {
            text: component.$t('newNote').toString(),
            className: 'btn btn-primary',
            attr: {
              'data-toggle': 'modal',
              'data-target': '#noteModal'
            },
            action(): void {
              component.selectedRow = null;
            }
          }
        ],
        columns: [
          {
            title: this.$t('name').toString(),
            width: '15%',
            render(data, type, row: row): string {
              return row[1];
            }
          },
          {
            title: this.$t('content').toString(),
            render(data, type, row: row): string {
              return row[2];
            }
          },
          {
            title: this.$t('updatedAt').toString(),
            width: '15%',
            render(data, type, row: row): string {
              let time: number = new Date(row[3]).getTime();
              return `<span class="hidden">${time}</span>${moment(row[3]).format(config.dateFormat)}`;
            }
          },
          {
            title: this.$t('more').toString(),
            width: '15%',
            data: null,
            orderable: false,
            render(): string {
              return `<a class="note-editor">
                ${component.$t('workspace')}</a> /
                <a class="note-settings" data-toggle="modal" data-target="#noteModal">${component.$t('details')}</a>`;
            }
          }
        ],
        rowCallback(row, data): void {
          $(row).attr('hash', data[0]);
        },
        drawCallback(): void {
          // Double click row event, redirect to dashboard
          $('#notesTable tbody tr').unbind('dblclick');
          $('#notesTable tbody tr').on('dblclick', 'td', (evt: JQuery.DoubleClickEvent): void => {
            if (
              $(evt.target)
                .closest('td')
                .index() < 3
            ) {
              let hash: string = $(evt.target)
                .closest('tr')
                .attr('hash');
              if (hash) {
                component.$router.push(`/note/${hash}`);
              }
            }
          });

          // Actions events
          $('.note-editor').unbind('click');
          $('.note-editor').click((evt: JQuery.ClickEvent): void => {
            let hash: string = $(evt.target)
              .closest('tr')
              .attr('hash');
            component.$router.push(`/note/${hash}`);
          });
          $('.note-settings').unbind('click');
          $('.note-settings').click((evt: JQuery.ClickEvent): void => {
            let hash: string = $(evt.target)
              .closest('tr')
              .attr('hash');
            component.selectedRow = component.GetNoteID(hash);
          });
        }
      });
    } catch (err) {
      this.$notify({
        type: 'danger',
        title: this.$t('notes').toString(),
        text: err
      });

      // @ts-ignore
      this.$Progress.fail();
    }
  }

  private async mounted(): Promise<void> {
    // Load datatable
    this.InitList();

    // State control
    this.socket.on(
      'connect',
      async (): Promise<void> => {
        await this.GetList();
      }
    );

    // Data flow control
    this.socket.on('createNote', this.CreateNote);
    this.socket.on('updateNote', this.UpdateNote);
    this.socket.on('removeNote', this.RemoveNote);

    // Get current state of list
    await this.GetList();
  }

  private destroyed(): void {
    this.socket.off('createNote');
    this.socket.off('updateNote');
    this.socket.off('removeNote');
    this.notesTable.destroy();
    this.notesTable = null;
  }
}
