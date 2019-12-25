import { Component, Vue } from 'vue-property-decorator';
import SidebarMenu from '@/components/layout/SidebarMenu/index.vue';

@Component({
  components: {
    SidebarMenu
  }
})
export default class Sidebar extends Vue {}
