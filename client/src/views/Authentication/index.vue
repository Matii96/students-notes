<template>
  <div class="login-box">
    <div class="login-logo">
      {{ $t('serviceName') }}
    </div>
    <login v-model="passwordRecovery" v-if="!passwordRecovery" />
    <password-recovery v-model="passwordRecovery" v-else />
  </div>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>

<style scoped>
.login-logo {
  font-weight: bold;
}
</style>
