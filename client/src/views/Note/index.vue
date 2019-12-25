<template>
  <router-view :socket="socket" v-if="socket" />
</template>

<script lang="ts">
import script from '.';
export default script;
</script>
