<template>
  <form :class="$props.create ? 'modal-content' : ['box', 'box-primary']" @submit.prevent="Submit">
    <div class="modal-header" v-if="$props.create">
      <button type="button" class="close" data-dismiss="modal">&times;</button>
      <h4 class="modal-title">{{ $t('newUser') }}</h4>
    </div>
    <div class="box-header with-border" v-else>
      <h3 class="box-title">{{ $t('data') }}</h3>
    </div>
    <div :class="$props.create ? 'modal-body' : 'box-body'">
      <div class="row">
        <div class="col-sm-6">
          <div :class="errors.name ? ['form-group', 'has-error'] : 'form-group'">
            <label>{{ $t('name') }}</label>
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </span>
              <input class="form-control" name="name" type="text" v-model="name" :disabled="$props.locked" ref="name" />
            </div>
            <span class="help-block" v-if="errors.name">{{ errors.name }}</span>
          </div>
        </div>
        <div class="col-sm-6">
          <div :class="errors.email ? ['form-group', 'has-error'] : 'form-group'">
            <label>{{ $t('email') }}</label>
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </span>
              <input
                class="form-control"
                name="email"
                type="text"
                v-model="email"
                :disabled="$props.locked"
                ref="email"
              />
            </div>
            <span class="help-block" v-if="errors.email">{{ errors.email }}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <div class="form-group">
            <label>{{ $t('language') }}</label>
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </span>
              <select class="form-control" v-model="lang" :disabled="$props.locked" ref="lang">
                <template v-for="lang in languages">
                  <option :value="lang.code">{{ lang.name }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="form-group">
            <label>{{ $t('role') }}</label>
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </span>
              <select class="form-control" v-model="roleId" :disabled="$props.locked">
                <template v-for="role in roles">
                  <option :value="role.id">{{ role.name }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div :class="errors.description ? ['form-group', 'has-error'] : 'form-group'">
            <label>{{ $t('description') }}</label>
            <textarea
              class="form-control"
              name="description"
              v-model="description"
              rows="2"
              :disabled="$props.locked"
              ref="description"
            ></textarea>
            <span class="help-block" v-if="errors.description">{{ errors.description }}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <div :class="errors.password ? ['form-group', 'has-error'] : 'form-group'">
            <label>{{ $t('password') }}</label>
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </span>
              <input
                class="form-control"
                name="password"
                type="password"
                v-model="password"
                :disabled="$props.locked"
                ref="password"
              />
            </div>
            <span class="help-block" v-if="errors.password">{{ errors.password }}</span>
          </div>
        </div>
        <div class="col-sm-6">
          <div :class="errors.passwordConfirmation ? ['form-group', 'has-error'] : 'form-group'">
            <label>{{ $t('repeatPassword') }}</label>
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </span>
              <input
                class="form-control"
                type="password"
                v-model="confirmPassword"
                :disabled="$props.locked"
                ref="confirmPassword"
              />
            </div>
            <span class="help-block" v-if="errors.passwordConfirmation">{{ errors.passwordConfirmation }}</span>
          </div>
        </div>
      </div>
    </div>
    <div :class="$props.create ? 'modal-footer' : 'box-footer'">
      <button :class="readyToSubmit ? ['btn', 'btn-primary', 'pull-right'] : ['btn', 'btn-disabled', 'pull-right']">
        <i class="fa fa-check"></i>
        {{ $t('confirm') }}
      </button>
    </div>
  </form>
</template>

<script>
import Joi from 'joi-browser';

export default {
  name: 'UserDataform',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          name: null,
          email: null,
          lang: null,
          roleId: null,
          description: null
        };
      }
    },
    locked: {
      type: Boolean,
      default: false
    },
    usedNames: {
      type: Array,
      default: () => {
        return [];
      }
    },
    required: {
      type: Array,
      default: () => {
        return [];
      }
    },
    socket: {
      type: Object
    },
    // Boolean, indicates if form is used to create new user
    create: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: null,
      email: null,
      password: null,
      description: null,
      confirmPassword: null,

      roleId: 2,
      roles: [],
      lang: 'en',
      languages: [
        {
          code: 'en',
          name: 'English'
        }
      ]
    };
  },
  watch: {
    '$props.data'(to) {
      this.name = to.name;
      this.email = to.email;
      this.language = to.language;
      this.roleId = to.roleId;
      this.description = to.description;
    },
    '$props.locked'(to, from) {
      // check if form has been unlocked
      if (from && !to) {
        this.$nextTick(() => {
          this.$refs.name.focus();
        });
      }
    }
  },
  computed: {
    submitData() {
      // Gather all changes
      let data = {};
      for (let attribute of ['name', 'email', 'lang', 'roleId', 'description', 'password']) {
        if (this[attribute] !== this.$props.data[attribute]) {
          data[attribute] =
            this[attribute] && (typeof this[attribute] !== 'string' || this[attribute].length) > 0
              ? this[attribute]
              : null;
        }
      }

      if (data.password === null) {
        delete data.password;
      }
      return data;
    },
    errors() {
      if (this.$props.locked) {
        return {};
      }

      // Test new data
      let result = Joi.validate(
        this.submitData,
        Joi.object().keys({
          name: Joi.string()
            .min(2)
            .max(100)
            .invalid(this.$props.usedNames)
            .error(errors => {
              return {
                message: this.$t('nameValidation')
              };
            }),
          description: Joi.string()
            .allow(null)
            .max(4096)
            .error(errors => {
              return {
                message: this.$t('descriptionValidation')
              };
            }),
          email: Joi.string()
            .email({ minDomainSegments: 2 })
            .allow(null)
            .max(255)
            .error(errors => {
              return {
                message: this.$t('emailValidation')
              };
            }),
          lang: Joi.string()
            .allow(null)
            .max(255),
          roleId: Joi.number()
            .integer()
            .min(1),
          password: Joi.string()
            .allow(null)
            .min(2)
            .max(255)
            .error(errors => {
              return {
                message: this.$t('passwordValidation')
              };
            })
        }),
        {
          abortEarly: false
        }
      );

      // Errors handling
      let errors = {};
      if (result.error) {
        for (let error of result.error.details) {
          errors[error.context.key] = error.message;
        }
      }

      if (this.password !== this.confirmPassword) {
        errors['passwordConfirmation'] = this.$t('passwordConfirmation');
      }

      return errors;
    },
    readyToSubmit() {
      for (let prop of this.$props.required) {
        if (this.submitData[prop] === undefined) {
          return false;
        }
      }
      return !this.$props.locked && Object.keys(this.errors).length === 0;
    }
  },
  methods: {
    Submit() {
      // Check if form is correct and there are any changes
      if (!this.readyToSubmit) {
        return;
      }
      this.$parent.Submit(this.submitData);
    },
    GetFormData(data) {
      data.roles.sort((roleA, roleB) => (roleA.name > roleB.name ? 1 : -1));
      this.roles = data.roles;
    }
  },
  mounted() {
    // If form is unlock by default then focus on name
    if (!this.$props.locked) {
      this.$refs.name.focus();
    }

    // State control
    this.$props.socket.on('getFormData', this.GetFormData);
    this.$props.socket.emit('getFormData');
  },
  destroyed() {
    this.$props.socket.off('getFormData');
  }
};
</script>

<style scoped>
textarea[name='description'] {
  resize: vertical;
}
</style>
