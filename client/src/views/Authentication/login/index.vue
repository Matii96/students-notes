<template>
  <div class="login-box-body">
    <p class="login-box-msg">{{ $t('login') }}</p>

    <form class="row" @submit.prevent="CheckCreds">
      <div class="col-xs-12">
        <div class="form-group has-feedback">
          <input
            type="text"
            class="form-control"
            v-model="username"
            :placeholder="`${$t('email')} ${$t('or')} ${$t('username')}`"
            ref="username"
          />
          <span class="form-control-feedback">
            <i class="fa fa-user"></i>
          </span>
        </div>
        <div class="form-group has-feedback">
          <input type="password" class="form-control" v-model="password" :placeholder="$t('password')" />
          <span class="form-control-feedback">
            <i class="fa fa-key"></i>
          </span>
        </div>
        <div class="form-group text-center">
          <button class="btn btn-primary btn-block btn-flat">
            <i class="fa fa-sign-in"></i>
            {{ $t('signIn') }}
          </button>
        </div>
      </div>
    </form>
    <div class="row response" v-if="response">
      <div class="col-xs-12 text-danger text-center">
        {{ response }}
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 text-danger text-center">
        <a @click="$emit('input', true)">
          {{ $t('forgotPassword') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>

<style scoped>
.response {
  margin-bottom: 10px;
}
</style>
