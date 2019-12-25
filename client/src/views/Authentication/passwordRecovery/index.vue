<template>
  <div class="login-box-body">
    <div class="text-center go-back">
      <a @click="$emit('input', false)">
        <i class="fa fa-arrow-left"></i>
        {{ $t('return') }}
      </a>
    </div>
    <p class="login-box-msg">
      {{ $t('passwordRecovery') }}
    </p>

    <form class="row" @submit.prevent="ResetPassword">
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
        <div class="form-group text-center">
          <button class="btn btn-primary btn-block btn-flat">
            <i class="fa fa-key"></i>
            {{ $t('resetPassword') }}
          </button>
        </div>
      </div>
    </form>
    <div class="row response" v-if="responseType === 0">
      <div class="col-xs-12 text-info text-center">
        {{ $t('resettingPassword') }}
      </div>
    </div>
    <div class="row response" v-else-if="responseType === 1">
      <div class="col-xs-12 text-success text-center">
        {{ $t('newPasswordSent') }}
      </div>
    </div>
    <div class="row response" v-else-if="responseType === 2">
      <div class="col-xs-12 text-danger text-center">
        {{ response }}
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
.go-back {
  margin-bottom: 5px;
}
</style>
