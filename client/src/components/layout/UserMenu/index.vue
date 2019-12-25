<template>
  <li class="dropdown user user-menu" v-if="$store.state.user">
    <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
      <!-- The user image in the navbar-->
      <i class="fa fa-user" aria-hidden="true"></i>
      <!-- hidden-xs hides the username on small devices so only the image appears. -->
      <span class="hidden-xs">{{ $store.state.user.name }}</span>
    </a>
    <!-- Account Info and Menu -->
    <ul class="dropdown-menu">
      <li class="user-header" style="height:auto;min-height:85px;padding-bottom:15px;">
        <p>
          <span>{{ $store.state.user.name }}</span>
          <small> {{ $t('sessionExpires') }}: {{ $store.state.token.expiresIn }} </small>
        </p>
      </li>
      <li class="user-footer">
        <div class="pull-left">
          <router-link class="btn btn-default btn-flat btn-block" :to="`/user/${$store.state.user.hash}`">
            <i class="fa fa-cogs"></i>
            <span>{{ $t('settings') }}</span>
          </router-link>
        </div>
        <div class="pull-right">
          <a href="javascript:;" class="btn btn-default btn-flat btn-block" @click="Logout">
            <i class="fa fa-sign-out"></i>
            <span>{{ $t('logout') }}</span>
          </a>
        </div>
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>
