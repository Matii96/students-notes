<template>
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <!--
      <div class="user-panel">
        <div class="pull-left image">
          <img src="/static/img/logo.png" />
        </div>
        <div class="pull-left info">
          <div>
            <p class="white">{{ $store.state.user.name }}</p>
          </div>
          <a href="javascript:;">
            <i class="fa fa-circle text-success"></i> Online
          </a>
        </div>
      </div>
      -->

      <!-- search form (Optional) -->
      <!--
      <form v-on:submit.prevent class="sidebar-form" id="searchForm">
        <div class="input-group" id="searchContainer">
          <span class="input-group-btn">
            <input type="text"
            name="search"
            id="search"
            class="search form-control"
            data-toggle="hideseek"
            laceholder="Search Menus"
            data-list=".sidebar-menu">
            <button type="submit" name="search" id="search-btn" class="btn btn-flat">
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>
      </form>
      -->
      <!-- /.search form -->

      <!-- Sidebar Menu -->
      <sidebar-menu />
      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>

<style scoped>
.user-panel .image img {
  border-radius: 50%;
}
#searchForm {
  padding-left: 0em;
  padding-right: 0em;
}
#searchContainer {
  height: 100%;
  padding-bottom: 0em;
}
#search {
  width: 80%;
  float: right;
}

#search-btn {
  width: 20%;
}

@media only screen and (max-width: 767px) {
  .main-sidebar {
    padding-top: 50px;
  }
}
</style>
