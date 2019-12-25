import BaseApp from '@/app/main';

export default interface App extends BaseApp {
  Init(): Promise<void>;
}
