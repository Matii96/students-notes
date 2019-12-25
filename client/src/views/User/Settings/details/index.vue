<template>
  <div class="row">
    <div class="col-md-6">
      <div class="row">
        <div class="col-md-12">
          <dataform-self
            :data="formData"
            :locked="formLocked"
            :usedNames="usedNames"
            :usedPasswords="usedPasswords"
            :socket="$props.socket"
            v-if="$route.params.hash === $store.state.user.hash"
          />
          <dataform-other :data="formData" :locked="formLocked" :usedNames="usedNames" :socket="$props.socket" v-else />
        </div>
      </div>
      <div class="row" v-if="$route.params.hash !== $store.state.user.hash">
        <div class="col-md-12">
          <div class="box box-warning">
            <div class="box-header with-border">
              <h3 class="box-title">{{ $t('actions') }}</h3>
            </div>
            <div class="box-body">
              <button class="btn btn-primary" @click="ToggleStatus">
                <template v-if="formData.locked">
                  <i class="fa fa-unlock"></i>
                  {{ $t('unlock') }}
                </template>
                <template v-else>
                  <i class="fa fa-lock"></i>
                  {{ $t('lock') }}
                </template>
              </button>
              <button class="btn btn-danger pull-right" @click="Remove">
                <i class="fa fa-trash"></i>
                {{ $t('delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <login-history :socket="$props.socket" />
    </div>
  </div>
</template>

<script>
import api from '@/api/User';
import app from '@/main';
import DataformOther from '../dataform/otherUser';
import DataformSelf from '../dataform/self';
import LoginHistory from './loginHistory';

export default {
  name: 'UserDetails',
  props: ['socket'],
  components: {
    DataformOther,
    DataformSelf,
    LoginHistory
  },
  data() {
    return {
      formData: {},
      formLocked: true,
      usedNames: [],
      usedPasswords: [],
      history: []
    };
  },
  methods: {
    async GetDetails(updateForm) {
      if (!window.loading) {
        app.$Progress.start();
      }
      try {
        let response = await api.Details(this.$route.params.hash, this.range);
        this.history = response.data.history;
        if (updateForm) {
          this.formData = response.data;
        }
        this.formLocked = false;

        // Complete loading bar
        app.$Progress.finish();
      } catch (err) {
        this.$notify({
          type: 'danger',
          title: this.$t('user'),
          text: `${this.$t('errorAction')} ${err.response.status}`
        });

        // Complete loading bar
        app.$Progress.fail();
      }
    },
    async Submit(user) {
      try {
        if (window.loading) {
          return;
        }
        this.$Progress.start();
        await api.Update(this.$route.params.hash, user);
        this.$notify({
          type: 'success',
          title: this.$t('user'),
          text: this.$t('userUpdated')
        });
        this.correctPassword = true;

        // Redirect user
        if (this.$route.params.hash === this.$store.state.user.hash) {
          this.$router.go(-1);
        } else {
          this.$router.push('/users');
        }
      } catch (err) {
        this.$Progress.fail();
        // If error code is 400 then name is already taken
        if (err.response.status === 400) {
          switch (err.response.data.code) {
            case 1:
              if (this.usedNames.indexOf(user.name) === -1) {
                this.usedNames.push(user.name);
              }
              return;
            case 2:
              if (this.usedPasswords.indexOf(user.currentPassword) === -1) {
                this.usedPasswords.push(user.currentPassword);
              }
              return;
          }
        }
        this.$notify({
          type: 'danger',
          title: this.$t('user'),
          text: `${app.$t('errorAction')} ${err.response.status}`
        });
      }
    },
    async ToggleStatus() {
      try {
        await api.Update(this.$route.params.hash, {
          locked: !this.formData.locked
        });
        this.formData.locked = !this.formData.locked;
      } catch (err) {
        this.$notify({
          type: 'danger',
          title: this.$t('user'),
          text: `${this.$t('errorAction')} ${err.response.status}`
        });
      }
    },
    async Remove() {
      if (!confirm(this.$t('confirmAsk'))) {
        return;
      }
      try {
        await api.Remove(this.$route.params.hash);
        this.$router.push('/users');
      } catch (err) {
        this.$notify({
          type: 'danger',
          title: this.$t('user'),
          text: `${this.$t('errorAction')} ${err.response.status}`
        });
      }
    }
  },
  async mounted() {
    // State control
    this.$props.socket.on('connect', async () => {
      await this.GetDetails();
    });

    // Get data from api
    await this.GetDetails(true);
  }
};
</script>
