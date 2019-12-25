<template>
  <div class="box box-info">
    <div class="box-header with-border ">
      <h3 class="box-title">{{ $t('loginHistory') }}</h3>
    </div>
    <div class="box-body activity-chart">
      <div class="row">
        <div class="col-sm-6">
          <div class="form-group">
            <label>{{ $t('range') }}</label>
            <date-range-picker v-model="dateRange" />
          </div>
        </div>
        <div class="col-sm-6">
          <div class="form-group">
            <label>{{ $t('search') }}</label>
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-search-plus" aria-hidden="true"></i>
              </span>
              <input class="form-control" type="text" v-model="search" />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="dataTables_wrapper form-inline dt-bootstrap">
            <table id="loginHistoryTable" class="table table-bordered table-striped dataTable"></table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import _ from 'lodash';
import api from '@/api/User';
import moment from 'moment';
import DateRangePicker from '@/components/shared/DateRangePicker/index.vue';
import config from '@/config';

export default {
  name: 'UserDetailsLoginHistory',
  props: ['socket'],
  components: {
    DateRangePicker
  },
  data() {
    return {
      historyTable: null,
      dateRange: null,
      search: '',
      FilterDelay: _.debounce(() => {
        this.historyTable.draw(false);
      }, config.typingDelay)
    };
  },
  watch: {
    dateRange(newRange, oldRange) {
      if (!oldRange) {
        return;
      }
      newRangeString = [newRange[0].toISOString(), newRange[1].toISOString()].join(' - ');
      this.historyTable.columns(0).search(newRangeString);
      this.historyTable.draw(false);
    },
    search(newValue) {
      this.historyTable.search(newValue);
      this.FilterDelay();
    }
  },
  methods: {
    CreateEntry() {
      this.historyTable.ajax.reload(null, false);
    },
    async InitList() {
      try {
        // Inject datatable
        this.historyTable = $('#loginHistoryTable').DataTable({
          dom:
            '<"row"<"col-sm-6"l><"col-sm-6">>' +
            '<"row"<"col-sm-12 table-responsive"tr>>' +
            '<"row"<"col-sm-5"i><"col-sm-7"p>>',
          lengthMenu: [
            [5, 10, 25],
            [5, 10, 25]
          ],
          pageLength: 5,
          processing: true,
          serverSide: true,
          deferLoading: 0,
          info: true,
          ajax: api.LoginHistory(this.$route.params.hash),
          columns: [
            {
              title: this.$t('date'),
              width: '22%',
              render(data, type, row) {
                let time = new Date(data).getTime();
                return moment(time).format(config.dateFormat);
              }
            },
            {
              title: this.$t('address'),
              width: '26%'
            },
            {
              title: this.$t('browser'),
              width: '26%'
            },
            {
              title: this.$t('os'),
              width: '26%'
            }
          ],
          order: [[0, 'desc']]
        });
      } catch (err) {
        this.$notify({
          type: 'danger',
          title: this.$t('user'),
          text: err
        });
        this.$Progress.fail();
      }
    }
  },
  async mounted() {
    // Load datatable
    await this.InitList();
    let newRangeString = [this.dateRange[0].toISOString(), this.dateRange[1].toISOString()].join(' - ');
    this.historyTable
      .columns(0)
      .search(newRangeString)
      .draw(false);

    // State control
    this.$props.socket.on('connect', async () => {
      this.historyTable.ajax.reload();
    });
  },
  destroyed() {
    this.historyTable.destroy();
  }
};
</script>
