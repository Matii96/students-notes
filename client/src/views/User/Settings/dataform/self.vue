<template>
  <form class="box box-primary" @submit.prevent="Submit">
    <div class="box-header with-border">
      <h3 class="box-title">{{ $t('data') }}</h3>
    </div>
    <div class="box-body">
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
          <div :class="errors.currentPassword ? ['form-group', 'has-error'] : 'form-group'">
            <label>{{ $t('currentPassword') }}</label>
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </span>
              <input
                class="form-control"
                name="currentPassword"
                type="password"
                v-model="currentPassword"
                :disabled="$props.locked"
                ref="currentPassword"
              />
            </div>
            <span class="help-block" v-if="errors.currentPassword">{{ errors.currentPassword }}</span>
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
                :disabled="$props.locked || currentPassword === undefined"
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
                :disabled="$props.locked || currentPassword === undefined"
                ref="confirmPassword"
              />
            </div>
            <span class="help-block" v-if="errors.passwordConfirmation">{{ errors.passwordConfirmation }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box-footer">
      <button :class="readyToSubmit ? ['btn', 'btn-primary', 'pull-right'] : ['btn', 'btn-disabled', 'pull-right']">
        <i class="fa fa-check"></i>
        {{ $t('confirm') }}
      </button>
    </div>
  </form>
</template>

<script>
import Joi from 'joi-browser';
import Localization from '@/localization';

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
          description: null,
          currentPassword: null
        };
      }
    },
    usedPasswords: {
      type: Array,
      default: () => {
        return [];
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
    }
  },
  data() {
    return {
      name: null,
      email: null,
      password: null,
      description: null,
      confirmPassword: null,
      currentPassword: null,

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
      this.lang = to.lang;
      this.description = to.description;
      this.currentPassword = to.currentPassword;
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
      for (let attribute of ['name', 'email', 'lang', 'description', 'password', 'currentPassword']) {
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
          currentPassword: Joi.string()
            .max(255)
            .invalid(this.$props.usedPasswords)
            .error(errors => {
              return {
                message: this.$t('incorrectCurrentPassword')
              };
            }),
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
      if (this.submitData.lang) {
        this.$store.commit('ChangeUserLang', this.submitData.lang);
        Localization.ChangeLanguage(this.submitData.lang);
      }
      this.$parent.Submit(this.submitData);
    }
  },
  mounted() {
    // If form is unlock by default then focus on name
    if (!this.$props.locked) {
      this.$refs.name.focus();
    }
  }
};
</script>

<style scoped>
textarea[name='description'] {
  resize: vertical;
}
</style>
