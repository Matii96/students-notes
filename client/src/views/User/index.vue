<template>
  <router-view :socket="socket" v-if="socket" />
</template>

<script>
import io from 'socket.io-client';
import store from '@/store';
import app from '@/main';
import config from '@/config';

export default {
  name: 'User',
  props: ['socketsDict'],
  data() {
    return {
      socket: null
    };
  },
  methods: {
    UpdateMeta(data) {
      this.$parent.SetDashMeta([
        {
          name: `${this.$t('user')} ${data.name}`,
          description: data.description,
          path: `/user/${this.$route.params.hash}`
        }
      ]);
    },
    RemoveUser() {
      this.$notify({
        type: 'warn',
        title: this.$t('user'),
        text: this.$t('userRemoved')
      });
      this.$router.push('/');
    }
  },
  beforeCreate() {
    this.$parent.SetDashMeta([
      {
        name: this.$t('user'),
        path: `/user/${this.$route.params.hash}`
      }
    ]);
  },
  created() {
    // Connect to user socket
    let socket = io(config.serverURI + 'usersocket', {
      secure: true,
      transports: ['websocket'],
      query: {
        hash: this.$route.params.hash,
        token: store.state.token.hash
      }
    });

    // Dash meta control
    socket.on('updateMeta', this.UpdateMeta);
    socket.on('removeUser', this.RemoveUser);

    // Load router view after connection to server
    socket.on('connect', () => {
      // Add socket to dash list
      this.$props.socketsDict['user'] = socket;

      // Forward to route view
      socket.off('connect');
      socket.off('disconnect');
      this.socket = socket;
    });
    socket.on('disconnect', () => {
      app.$Progress.fail();
      this.$router.push('/');
    });
  },
  destroyed() {
    delete this.$props.socketsDict['user'];
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>
