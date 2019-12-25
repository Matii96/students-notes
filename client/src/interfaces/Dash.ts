import { Route } from 'vue-router';
import IRoute from './Route';

export default interface IDash {
  SetDashMeta: (meta?: IRoute[]) => void;
}
