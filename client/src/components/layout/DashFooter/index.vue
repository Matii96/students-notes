<template>
  <footer class="main-footer">
    <div class="pull-right">
      <b>{{ $t('version') }}</b>
      {{ version }}
    </div>
    <strong
      >Copyright &copy; {{ year }}
      <a href="https://github.com/Matii96/students-notes" target="_blank">Matii96</a>.</strong
    >
    {{ $t('allRightsReserved') }}.
  </footer>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>
