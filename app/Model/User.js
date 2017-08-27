'use strict'

const _ = require('lodash')

const Base = use('App/Model/Base')
const Exceptions = use('App/Exceptions')
const Antl = use('Antl')

class User extends Base {
  static get ROLES () {
    return {
      ADMIN: 'admin',
      MEMBER: 'member'
    }
  }

  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'User.encryptPassword')
    this.addHook('beforeUpdate', 'User.encryptPassword')
  }

  static get sanitizationRules () {
    return {
      name: 'trim',
      email: 'trim|normalize_email:!rd,!re,!lc',
      password: 'trim',
      password_confirmation: 'trim'
    }
  }

  /**
   * Validation
   */
  static get loginRules () {
    return {
      email: 'required|email|max:255',
      password: 'required|strongPassword'
    }
  }

  static get validationMessages () {
    return {
      'email.required': `${Antl.get('model.errors.required')} ${Antl.get('user.email')}`,
      'email.email': `${Antl.get('user.email')} ${Antl.get('model.errors.invalid')}`,
      'email.max': `${Antl.get('user.email')} ${Antl.get('model.errors.less_than_or_equal_to')}`,
      'password.required': `${Antl.get('model.errors.required')} ${Antl.get('user.password')}`,
      'password.strongPassword': `${Antl.get('user.password')} ${Antl.get('model.errors.invalid')}`
    }
  }

  toLoginJSON () {
    return this._toCustomJSON(['id', 'email', 'name', 'role'])
  }

  _toCustomJSON (fields = []) {
    return _(this.attributes)
      .pick(fields)
      .transform((result, value, key) => {
        result[key] = this[key]
      })
      .merge(this.initializeComputedProperties())
      .merge(this.serializeRelations())
      .value()
  }
}

module.exports = User
