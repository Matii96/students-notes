<template>
  <div class="row">
    <div class="col-md-12">
      <TopBar :socket="socket" />
      <Editor :socket="socket" />
    </div>
  </div>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>
