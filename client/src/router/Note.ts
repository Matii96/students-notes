import { RouteConfig } from 'vue-router';

export default [
  {
    name: 'Notes',
    path: 'notes',
    component: () => import('@/views/Note/General/index.vue'),
    children: [
      {
        name: 'NotesList',
        path: 'list',
        alias: '',
        component: () => import('@/views/Note/General/list/index.vue'),
        meta: {
          auth: [1, 2],
          displayName: 'List'
        }
      }
    ],
    meta: {
      auth: [1, 2]
    }
  },
  {
    name: 'Note',
    path: 'note/:hash',
    component: () => import('@/views/Note/index.vue'),
    children: [
      {
        name: 'Workspace',
        path: 'workspace',
        alias: '',
        component: () => import('@/views/Note/Workspace/index.vue'),
        meta: {
          auth: [1, 2]
        }
      }
    ],
    meta: {
      auth: [1, 2]
    }
  }
] as RouteConfig[];
