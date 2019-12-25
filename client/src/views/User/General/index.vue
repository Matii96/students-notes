<template>
  <router-view :socket="socket" v-if="socket" />
</template>

<script>
import io from 'socket.io-client';
import store from '@/store';
import app from '@/main';
import config from '@/config';

export default {
  name: 'Users',
  props: ['socketsDict'],
  data() {
    return {
      socket: null
    };
  },
  beforeCreate() {
    this.$parent.SetDashMeta([
      {
        name: this.$t('users')
      }
    ]);
  },
  created() {
    // Connect to users socket
    let socket = io(config.serverURI + 'userssocket', {
      secure: true,
      transports: ['websocket'],
      query: {
        token: store.state.token.hash
      }
    });

    // Load router view after connection to server
    socket.on('connect', async () => {
      // Add socket to dash list
      this.$props.socketsDict['users'] = socket;

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
    if (this.socket) {
      this.socket.disconnect();
      delete this.$props.socketsDict['users'];
    }
  }
};
</script>
