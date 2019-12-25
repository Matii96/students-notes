<template>
  <header class="main-header">
    <span class="logo-mini">
      <router-link to="/">
        <div
          id="dashLogo"
          alt="Logo"
          :class="
            sidebarCollapsed
              ? ['img-responsive', 'center-block', 'logo', 'logo-square']
              : ['img-responsive', 'center-block', 'logo', 'logo-rectangle']
          "
          ref="logo"
        />
      </router-link>
    </span>
    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
      <!-- Sidebar toggle button-->
      <a href="javascript:;" class="sidebar-toggle" data-toggle="push-menu" role="button" ref="sidebarToggle">
        <span class="sr-only">Toggle navigation</span>
      </a>
      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!--
          <messages-menu></messages-menu>
          <notifications-menu></notifications-menu>
          <tasks-menu></tasks-menu>
          -->
          <user-menu />
        </ul>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>

<style scoped>
@media only screen and (max-width: 767px) {
  .logo-mini {
    display: none;
  }
}
.online {
  height: 15px;
  width: 15px;
  background-color: #28a745 !important;
  border-radius: 50%;
  display: inline-block;
}
.offline {
  height: 15px;
  width: 15px;
  background-color: #dc3545 !important;
  border-radius: 50%;
  display: inline-block;
}
.logo {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.logo-square {
  background-image: url('/static/img/logo.png');
}
.logo-rectangle {
  background-image: url('/static/img/logoStretch.png');
}
</style>
