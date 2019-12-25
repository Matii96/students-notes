import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  mutations,
  actions: {},
  modules: {}
});
