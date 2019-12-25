import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import store from '@/store';
import UserSidebarMenu from '@/policies/UserSidebarMenu';
import IRedirection from '@/interfaces/Router/Redirection';
import routes from './routes';

Vue.use(VueRouter);

export default class Router {
  public readonly vueRouter: VueRouter;

  public constructor() {
    this.vueRouter = new VueRouter({
      routes,
      mode: 'history',
      linkExactActiveClass: 'active',
      base: process.env.BASE_URL,
      scrollBehavior(to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 };
      }
    });
    this.vueRouter.beforeEach(this.BeforeEach.bind(this));
  }

  private CheckAccess(meta: any, destination: string): IRedirection {
    let loginRedirection: IRedirection = {
      path: '/login',
      query: { redirect: destination }
    };
    // Check if meta.auth is defined
    if (meta === undefined || meta.auth === undefined) {
      return;
    }

    // Check if route is allowed for logged in users
    if (meta.disableLoggedUser) {
      if (store.state.user) {
        return { path: '/' };
      }
      return;
    }

    // Check token expiration date
    if (!store.state.token) {
      return loginRedirection;
    }
    let now = new Date();
    if (now.getTime() > store.state.token.expiresIn) {
      store.commit('SetUser', null);
      store.commit('SetToken', null);
      return loginRedirection;
    }

    // Check access to route
    if (meta.auth.indexOf(store.state.user.role) === -1) {
      return loginRedirection;
    }
  }

  private BeforeEach(to: Route, from: Route, next: (to?: IRedirection) => void): void {
    let accessDenied: IRedirection = this.CheckAccess(to.meta, to.fullPath);

    // Check if route is accepted
    if (accessDenied) {
      next(accessDenied);
      return;
    }

    // Redirect user to default route
    if (to.fullPath === '/') {
      if (store.state.user) {
        next({
          path: UserSidebarMenu(store.state.user).default
        });
      } else {
        next({
          path: '/login'
        });
      }
      return;
    }

    // Check if new route is different than previous
    if (from.name === to.name) {
      window.location.href = to.path;
      return;
    }

    // Forward to route
    next();
  }
}
