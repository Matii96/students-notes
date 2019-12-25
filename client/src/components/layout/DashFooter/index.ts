import { Component, Vue } from 'vue-property-decorator';
import config from '@/config';

@Component
export default class DashFooter extends Vue {
  private year: number;
  private version: string;

  public constructor() {
    super();
    this.year = new Date().getFullYear();
    this.version = config.version;
  }
}
