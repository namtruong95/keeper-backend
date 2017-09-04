'use strict'

const _ = require('lodash')

const Base = use('App/Model/Base')
const Exceptions = use('App/Exceptions')
const Antl = use('Antl')

class Account extends Base {

  static get deleteTimestamp () {
    return 'deleted_at'
  }

  static get sanitizationRules () {
    return {
      title: 'trim',
      username: 'trim',
      password: 'trim'
    }
  }

  static get accountRules () {
    return {
      title: 'required|max:255',
      username: 'required|max:255',
      password: 'required|max:60'
    }
  }

  static get validationMessages () {
    return {
      'title.required': `${Antl.get('model.errors.required')} ${Antl.get('account.title')}`,
      'title.max': `${Antl.get('account.title')} ${Antl.get('model.errors.less_than_or_equal_to')}`,
      'username.required': `${Antl.get('model.errors.required')} ${Antl.get('account.username')}`,
      'username.max': `${Antl.get('account.username')} ${Antl.get('model.errors.less_than_or_equal_to')}`,
      'password.required': `${Antl.get('model.errors.required')} ${Antl.get('account.password')}`,
      'password.max': `${Antl.get('account.password')} ${Antl.get('model.errors.less_than_or_equal_to')}`,
    }
  }

  static notFound () {
    throw new Exceptions.ApplicationException(
      Antl.formatMessage('common.not_found', { name: Antl.get('common.account') }),
      404
    )
  }
}

module.exports = Account
