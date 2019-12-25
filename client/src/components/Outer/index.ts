import $ from 'jquery';
import { Component, Vue, Watch } from 'vue-property-decorator';
import OuterHeader from '@/components/layout/OuterHeader.vue';
import DashFooter from '@/components/layout/DashFooter/index.vue';
import localization from '@/localization';

@Component({
  components: {
    OuterHeader,
    DashFooter
  }
})
export default class Outer extends Vue {
  private languageSet: boolean;

  public constructor() {
    super();
    this.languageSet = false;
  }

  @Watch('$route.params.lang')
  private OnLanguageChange(lang: string): void {
    localization.ChangeLanguage(lang);
  }

  private async created(): Promise<void> {
    $('body').addClass('layout-top-nav');

    // Adjust language for user
    let lang: string = window.navigator.language.split('-')[0];
    await localization.ChangeLanguage(lang);
    this.languageSet = true;
  }

  private destroyed(): void {
    $('body').removeClass('layout-top-nav');
  }
}
