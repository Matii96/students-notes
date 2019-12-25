<template>
  <div id="noteModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="Submit">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">
            <span v-if="selectedRow === null || notes[selectedRow] === undefined">
              {{ $t('newNote') }}
            </span>
            <span v-else> {{ $t('note') }} {{ notes[selectedRow][1] }} </span>
          </h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <div :class="errors.name ? ['form-group', 'has-error'] : 'form-group'">
                <label>{{ $t('name') }}</label>
                <div class="input-group">
                  <span class="input-group-addon">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                  </span>
                  <input class="form-control" name="name" type="text" v-model="name" ref="name" />
                </div>
                <span class="help-block" v-if="errors.name">{{ errors.name }}</span>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label>{{ $t('users') }}</label>
                <Select2
                  v-model="selectedUsers"
                  :options="users"
                  :settings="{ multiple: true, width: '100%', placeholder: $t('selectAllowedUsers') }"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button :class="readyToSubmit ? ['btn', 'btn-primary', 'pull-right'] : ['btn', 'btn-disabled', 'pull-right']">
            <i class="fa fa-check"></i>
            {{ $t('confirm') }}
          </button>
          <button class="btn btn-danger pull-left" v-if="selectedRow !== null" @click.prevent="Delete">
            <i class="fa fa-check"></i>
            {{ $t('remove') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>
