<template>
  <div class="wrapper" v-if="languageSet">
    <!-- Horizontal bar at top. Contains messages, notifications, tasks and user menu -->
    <dash-header />

    <!-- Left side column. contains the logo and sidebar -->
    <sidebar />

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <dash-meta :panelMeta="panelMeta" />
      <section class="content">
        <router-view :socketsDict="socketsDict" />
      </section>
    </div>
    <!-- /.content-wrapper -->

    <!-- Horizontal bar at bottom. Contains copy right -->
    <dash-footer />

    <!-- Connecting to server animation -->
    <loading-overlay v-if="Object.values(socketsDict).some(socket => !socket.connected)" />
  </div>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>

<style>
@media (max-width: 767px) {
  .wrapper.hide_logo .main-header .logo {
    display: none;
  }
}

.logo-mini,
.logo-lg {
  text-align: left;
}
.logo-mini img,
.logo-lg img {
  padding: 0.4em !important;
}

.logo-lg img {
  display: -webkit-inline-box;
  width: 25%;
}

.user-panel {
  height: 4em;
}

hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}
</style>

<style scoped>
@media (max-width: 767px) {
  .fixed .content-wrapper,
  .fixed .right-side,
  .fixed .control-sidebar {
    padding-top: 50px;
  }
}
</style>
