import { RouteConfig } from 'vue-router';

import Authentication from './Authentication';
import Note from './Note';
import User from './User';

export default [
  {
    path: '/',
    name: 'Dash',
    component: () => import('@/components/Dash/index.vue'),
    children: [
      ...User,
      ...Note
      // another route
    ]
  },
  {
    path: '/',
    name: 'Outer',
    component: () => import('@/components/Outer/index.vue'),
    children: [
      ...Authentication,
      {
        path: '*',
        component: () => import('@/components/errors/404.vue')
      }
    ]
  }
] as RouteConfig[];
