export default interface ISidebarMenu {
  menu: {
    header: string;
    links: {
      name: string;
      icon: string[],
      path: string,
      default?: boolean;
    }[]
  }[]
  default: string;
}