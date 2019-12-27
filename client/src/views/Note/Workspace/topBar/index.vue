<template>
  <div class="topBar">
    <div class="tabs">
      <div id="tab-workspace" class="tab tabon">{{ $t('toolbox') }}</div>
    </div>
    <div class="tabs-right" v-if="participants.length > 1 || (participants.length === 1 && participants[0].count > 1)">
      <div class="tab taboff" v-for="participant in participants">
        <i class="fa fa-user" aria-hidden="true"></i>
        {{ participant.name }}
        <template v-if="participant.count > 1"> ({{ participant.count }}) </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>

<style scoped>
.tabs {
  display: flex;
}
#tab-workspace {
  width: 130px;
}
#tab-reports {
  color: black;
}
.running {
  background-color: #ffc107;
}
.tab-instance {
  cursor: pointer;
}
.tab-instance-running {
  background-color: #28a745 !important;
}
.tab-instance-terminated {
  background-color: #dc3545 !important;
}
.tab-instance:nth-child(4) {
  margin-left: 20px;
}
</style>
