<template>
  <div class="wrapper" v-if="languageSet">
    <!-- Horizontal bar at top. Contains messages, notifications, tasks and user menu -->
    <outer-header />

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <section class="content">
        <router-view />
      </section>
    </div>
    <!-- /.content-wrapper -->

    <!-- Horizontal bar at bottom. Contains copy right -->
    <dash-footer />
  </div>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>
