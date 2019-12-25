import { RouteConfig } from 'vue-router';

export default [
  {
    name: 'Login',
    path: 'login',
    alias: '',
    component: () => import('@/views/Authentication/index.vue'),
    meta: { disableLoggedUser: true }
  }
] as RouteConfig[];
