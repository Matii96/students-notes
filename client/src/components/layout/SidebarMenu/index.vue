<template>
  <ul class="sidebar-menu">
    <template v-for="group in menuTree.menu">
      <li class="header">{{ $t(group.header).toUpperCase() }}</li>
      <template v-for="link in group.links">
        <router-link v-if="link.path" tag="li" class="pageLink" :to="link.path" @click.native="ToggleSidebar()">
          <a>
            <i :class="link.icon"></i>
            <span class="page">{{ $t(link.name) }}</span>
          </a>
        </router-link>
        <li v-else class="treeview">
          <a href="#">
            <i :class="link.icon"></i>
            <span class="treeview-title">{{ $t(link.name) }}</span>
            <span class="pull-right-container pull-right">
              <i class="fa fa-angle-left fa-fw"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-for="route in link.routes">
              <a :href="route.path" @click="ToggleSidebar()">
                <i :class="'fa ' + route.icon"></i> {{ $t(route.name) }}
              </a>
            </li>
          </ul>
        </li>
      </template>
    </template>
  </ul>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>

<style scoped>
/* override default */
.sidebar-menu > li > a {
  padding: 12px 15px 12px 15px;
}

.sidebar-menu li.active > a > .fa-angle-left,
.sidebar-menu li.active > a > .pull-right-container > .fa-angle-left {
  animation-name: rotate;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

.treeview-title {
  z-index: 1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-90deg);
  }
}
</style>
