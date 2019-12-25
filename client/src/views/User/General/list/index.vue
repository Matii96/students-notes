<template>
  <div class="row">
    <div class="col-md-12">
      <div class="box box-primary">
        <div class="box-header">
          <h3 class="box-title">{{ $t('list') }}</h3>
        </div>
        <div class="box-body">
          <div class="row">
            <div class="col-lg-12 dataTables_wrapper form-inline dt-bootstrap">
              <table id="usersTable" class="table table-bordered table-striped dataTable"></table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import api from '@/api/User';
import app from '@/main';
import config from '@/config';

export default {
  name: 'UsersList',
  props: ['socket'],
  data() {
    return {
      headers: ['hash', 'name', 'description', 'email', 'role', 'locked', 'online'],
      users: [],
      usersTable: null
    };
  },
  methods: {
    GetUserID(hash) {
      for (let userRowID in this.users) {
        if (this.users[userRowID][0] === hash) {
          return userRowID;
        }
      }
      return null;
    },
    async GetList() {
      if (!window.loading) {
        app.$Progress.start();
      }
      try {
        let response = await api.List();
        this.users = response.data;

        // Replace content with new data
        if (this.usersTable) {
          this.usersTable.clear();
          this.usersTable.rows.add(this.users);
          this.usersTable.draw(false);
        }

        // Complete loading bar
        app.$Progress.finish();
      } catch (err) {
        this.$notify({
          type: 'danger',
          title: this.$t('users'),
          text: err
        });

        // Complete loading bar
        app.$Progress.fail();
      }
    },
    CreateUser(row) {
      this.users.push(row);
      this.usersTable.row.add(row);
      this.usersTable.draw(false);
    },
    UpdateUser(rows) {
      for (let row of rows) {
        let userRowID = this.GetUserID(row.hash);
        if (!this.users[userRowID]) {
          continue;
        }
        for (let cellName in row) {
          let idx = this.headers.indexOf(cellName);
          if (this.users[userRowID][idx] === row[cellName]) {
            continue;
          }
          this.$set(this.users[userRowID], idx, row[cellName]);
        }
        this.usersTable.row(userRowID).data(this.users[userRowID]);
      }
      this.usersTable.draw(false);
    },
    RemoveUser(hash) {
      let userRowID = this.GetUserID(hash);
      this.users.splice(userRowID, 1);
      this.usersTable.clear();
      this.usersTable.rows.add(this.users);
      this.usersTable.draw(false);
    },
    InitList() {
      let component = this;
      try {
        // Inject datatable
        this.usersTable = $('#usersTable').DataTable({
          data: this.companies,
          dom: config.datatables.btnNewDom,
          buttons: [
            {
              text: this.$t('newuser'),
              className: 'btn btn-primary',
              action(e, dt, node, config) {
                component.$router.push('/users/new');
              }
            }
          ],
          columns: [
            {
              title: this.$t('name'),
              width: '15%',
              render(data, type, row) {
                return row[1];
              }
            },
            {
              title: this.$t('description'),
              width: '25%',
              render(data, type, row) {
                return row[2];
              }
            },
            {
              title: this.$t('email'),
              render(data, type, row) {
                return row[3];
              }
            },
            {
              title: this.$t('role'),
              render(data, type, row) {
                return row[4] || app.$t('none');
              }
            },
            {
              title: this.$t('status'),
              width: '5%',
              render(data, type, row) {
                if (row[5]) {
                  return '<div class="bar-primary cell-value"><span class="hidden">1</span><i class="fa fa-lock"></i></div>';
                }
                return '<div class="bar-active cell-value"><span class="hidden">0</span><i class="fa fa-unlock"></i></div>';
              }
            },
            {
              title: this.$t('online'),
              width: '5%',
              render(data, type, row) {
                if (row[6]) {
                  return `<div class="bar-active"><span class="hidden">0</span><i class="fa fa-plug"></i> (${row[6]})</div>`;
                }
                return '<div class="bar-primary"><span class="hidden">1</span><i class="fa fa-unlink"></i></div>';
              }
            },
            {
              title: this.$t('more'),
              width: '5%',
              data: null,
              orderable: false,
              render(data, type, row) {
                return `<a class="user-settings">${app.$t('details')}</a>`;
              }
            }
          ],
          rowCallback(row, data) {
            $(row).attr('hash', data[0]);
            $(row).attr('company', data[4] ? data[4][0] : null);
          },
          columnDefs: [
            {
              targets: 3,
              createdCell(td, cellData, rowData, row, col) {
                if (rowData[4]) {
                  $(td).css('cursor', 'pointer');
                }
              }
            }
          ],
          drawCallback(settings, json) {
            let usersTable = $('#usersTable tbody tr');

            // Double click row event, redirect to user settings
            usersTable.unbind('dblclick');
            usersTable.on('dblclick', 'td', evt => {
              let colIdx = $(evt.target)
                .closest('td')
                .index();
              if (colIdx < 3 || colIdx === 4) {
                let hash = $(evt.target)
                  .closest('tr')
                  .attr('hash');
                if (hash) {
                  component.$router.push(`/user/${hash}`);
                }
              }
            });

            usersTable.unbind('click');
            usersTable.on('click', 'td:nth-child(4)', evt => {
              let companyHash = $(evt.target)
                .closest('tr')
                .attr('company');
              if (companyHash) {
                component.$router.push(`/company/${companyHash}`);
              }
            });

            // Actions events
            $('.user-settings').unbind('click');
            $('.user-settings').click(evt => {
              let hash = $(evt.target)
                .closest('tr')
                .attr('hash');
              component.$router.push(`/user/${hash}/settings`);
            });
          }
        });
      } catch (err) {
        this.$notify({
          type: 'danger',
          title: this.$t('users'),
          text: err
        });
        app.$Progress.fail();
      }
    }
  },
  async mounted() {
    // Load datatable
    this.InitList();

    // State control
    this.$props.socket.on('connect', async () => {
      await this.GetList();
    });

    // Data flow control
    this.$props.socket.on('createUser', this.CreateUser);
    this.$props.socket.on('updateUser', this.UpdateUser);
    this.$props.socket.on('removeUser', this.RemoveUser);

    // Get current state of list
    await this.GetList();
  },
  destroyed() {
    this.$props.socket.off('createUser');
    this.$props.socket.off('updateUser');
    this.$props.socket.off('removeUser');
    this.usersTable.destroy();
    this.usersTable = null;
  }
};
</script>

<style>
#usersTable tbody tr td:nth-child(1) {
  font-weight: bold;
}
#usersTable tbody tr {
  cursor: pointer;
}
#usersTable tbody tr td:nth-child(4),
#usersTable tbody tr td:nth-child(6),
#usersTable tbody tr td:nth-child(7),
#usersTable tbody tr td:nth-child(8) {
  cursor: auto;
}
</style>
