<template>
  <div class="row">
    <div class="col-md-12">
      <dataform-self
        :usedNames="usedNames"
        :required="['name', 'password']"
        :socket="$props.socket"
        v-if="$route.params.hash === $store.state.user.hash"
      />
      <dataform-other :usedNames="usedNames" :required="['name', 'password']" :socket="$props.socket" v-else />
    </div>
  </div>
</template>

<script>
import api from '@/api/User';
import app from '@/main';
import DataformOther from './dataform/otherUser';
import DataformSelf from './dataform/self';

export default {
  name: 'UserCreate',
  props: ['socket'],
  components: {
    DataformOther,
    DataformSelf
  },
  data() {
    return {
      formData: {},
      formLocked: true,
      usedNames: []
    };
  },
  methods: {
    async Submit(user) {
      try {
        this.$Progress.start();
        await api.Create(user);
        this.$router.push(`/users`);
      } catch (err) {
        this.$Progress.fail();

        // If error code is 400 then name is already taken
        if (err.response.status === 400 && this.usedNames.indexOf(user.name) === -1) {
          this.usedNames.push(user.name);
          return;
        }
        this.$notify({
          type: 'danger',
          title: this.$t('user'),
          text: `${this.$t('errorAction')} ${err.response.status}`
        });
      }
    }
  },
  async mounted() {
    // Complete loading bar
    app.$Progress.finish();
  }
};
</script>
