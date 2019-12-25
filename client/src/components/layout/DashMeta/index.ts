import { Component, Vue, Prop } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component
export default class DashMeta extends Vue {
  @Prop()
  private panelMeta!: Route[];
}
