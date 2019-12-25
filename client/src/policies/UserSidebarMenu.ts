import ILoginUser from '@/interfaces/Authentication/LoginUser';
import ISidebarMenu from '@/interfaces/SidebarMenu';

// Keys are user's roles
export default (user: ILoginUser): ISidebarMenu => {
  switch (user.role) {
    case 1:
      return {
        menu: [
          {
            header: 'tools',
            links: [
              {
                name: 'users',
                icon: ['fa', 'fa-users'],
                path: '/users'
              },
              {
                name: 'notes',
                icon: ['fa', 'fa-sticky-note-o'],
                path: '/notes'
              }
            ]
          }
        ],
        default: '/notes'
      };
    default:
    case 2:
      return {
        menu: [
          {
            header: 'tools',
            links: [
              {
                name: 'notes',
                icon: ['fa', 'fa-sticky-note-o'],
                path: '/notes'
              }
            ]
          }
        ],
        default: '/notes'
      };
  }
};
