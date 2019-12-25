<template>
  <div class="row">
    <div class="col-md-12">
      <div class="box box-primary">
        <div class="box-header">
          <h3 class="box-title">{{ $t('list') }}</h3>
        </div>
        <div class="box-body">
          <div class="row">
            <div class="col-lg-12 dataTables_wrapper form-inline dt-bootstrap">
              <table id="notesTable" class="table table-bordered table-striped dataTable"></table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Dataform :notes="notes" :selectedRow="selectedRow" :socket="socket" />
  </div>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>

<style>
#notesTable tbody tr td {
  cursor: pointer;
}
#notesTable tbody tr td:nth-child(4) {
  cursor: auto;
}
#notesTable tbody tr td:nth-child(1) {
  font-weight: bold;
}
</style>
