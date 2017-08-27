'use strict'

const bytes = require('bytes')

const AdonisValidator = use('Validator')
const Exceptions = use('App/Exceptions')

const Validator = exports = module.exports = {}

function validateMd5 (data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)

    if (!fieldValue) {
      return resolve('Skipping validation')
    }

    if ((/[a-fA-F0-9]{32}/).test(fieldValue)) {
      return resolve('Validation passed')
    }

    reject(message)
  })
}

function validateMimeType (data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)

    if (!fieldValue) {
      return resolve('Skipping validation')
    }

    if (typeof fieldValue.mimeType === 'function' && args.indexOf(fieldValue.mimeType()) > -1) {
      return resolve('Validation passed')
    }

    reject(message)
  })
}

function validateFileSize (data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)

    if (!fieldValue) {
      return resolve('Skipping validation')
    }

    if (typeof fieldValue.clientSize === 'function' && bytes(args[0]) >= fieldValue.clientSize()) {
      return resolve('Validation passed')
    }

    reject(message)
  })
}

function validatePositiveInteger (data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)

    if (!fieldValue) {
      return resolve('Skipping validation')
    }

    try {
      const MAX_INT32 = 2147483647

      if (!isNaN(fieldValue) && fieldValue >= 0 && fieldValue <= MAX_INT32) {
        return resolve('Validation passed')
      }
    } catch (e) {
      return reject(e.message)
    }

    reject(message)
  })
}

function validUAChannel (data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)

    if (!fieldValue) {
      return resolve('Skipping validation')
    }

    try {
      if (['ios', 'android', 'amazon'].indexOf(fieldValue) > -1) {
        return resolve('Validation passed')
      }
    } catch (e) {
      return reject(e.message)
    }

    reject(message)
  })
}

function strongPassword (data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/

    if (!fieldValue) {
      return resolve('Skipping validation')
    }

    try {
      if (strongRegex.test(fieldValue)) {
        return resolve('Validation passed')
      }
    } catch (e) {
      return reject(e.message)
    }

    reject(message)
  })
}

function uniqueWithoutTrashed (data, field, message, args, get) {
  const tableName = args[0]

  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)

    if (!fieldValue) {
      return resolve('Skipping validation')
    }

    try {
      return use('Database')
        .table(tableName)
        .select('id')
        .where('email', fieldValue)
        .where('deleted_at', null)
        .first()
        .then((result) => {
          return result ? reject(message) : resolve('Validation passed')
        })
        .catch(reject)
    } catch (e) {
      return reject(e.message)
    }
  })
}

function validateDatetime (data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)

    if (!fieldValue) return resolve('Skipping validation')

    return (new Date(fieldValue).toString() === 'Invalid Date') ? reject(message) : resolve('Validation passed')
  })
}

function validateAllSpace (data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)

    if (!fieldValue) return resolve('Skipping validation')

    return /\S+/.test(fieldValue) ? resolve('Validation passed') : reject(message)
  })
}

/**
 * @refer https://github.com/svenfuchs/rails-i18n/blob/master/rails/locale/ja.yml
 */
Validator.extendValidator = function () {
  AdonisValidator.extend('md5', validateMd5, 'MD5 validation failed on {{field}}')
  AdonisValidator.extend('mimeType', validateMimeType, 'Mine Type validation failed on {{field}}')
  AdonisValidator.extend('maxFileSize', validateFileSize, '{{field}} must be lower than {{data}}')
  AdonisValidator.extend('posInt', validatePositiveInteger, '{{field}} must be positive integer')
  AdonisValidator.extend('validUAChannel', validUAChannel, '{{field}} is invalid')
  AdonisValidator.extend('strongPassword', strongPassword, '{{field}} is invalid')
  AdonisValidator.extend('uniqueWithoutTrashed', uniqueWithoutTrashed, '{{field}} is invalid')
  AdonisValidator.extend('datetime', validateDatetime, '{{field}} is invalid')
  AdonisValidator.extend('allSpace', validateAllSpace, '{{field}} is invalid')

  AdonisValidator.quickValidate = function * (data, rules, messages) {
    const validation = yield AdonisValidator.validate(data, rules, messages)

    if (validation.fails()) {
      throw Exceptions.ValidationException.failed(validation.messages())
    }
  }

  AdonisValidator.sanitizor.extend('trim', function (value) {
    return (typeof (value) === 'string') ? value.trim() : value
  })
}
