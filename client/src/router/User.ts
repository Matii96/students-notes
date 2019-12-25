import { RouteConfig } from 'vue-router';

import UsersView from '@/views/User/General/index.vue';
import UsersListView from '@/views/User/General/list/index.vue';
import NewUserView from '@/views/User/Settings/create.vue';

import UserView from '@/views/User/index.vue';
import UserDetailsView from '@/views/User/Settings/details/index.vue';

export default [
  {
    name: 'Users',
    path: 'users',
    component: UsersView,
    children: [
      {
        name: 'UsersList',
        path: 'list',
        alias: '',
        component: UsersListView,
        meta: {
          auth: [1],
          displayName: 'List'
        }
      },
      {
        name: 'NewUser',
        path: 'new',
        component: NewUserView,
        meta: {
          auth: [1]
        }
      }
    ],
    meta: {
      auth: [1, 2]
    }
  },
  {
    name: 'User',
    path: 'user/:hash',
    component: UserView,
    children: [
      {
        name: 'UserDetails',
        path: 'settings',
        alias: '',
        component: UserDetailsView,
        meta: {
          auth: [1, 2],
          displayName: 'Details'
        }
      }
    ],
    meta: {
      auth: [1, 2]
    }
  }
] as RouteConfig[];
