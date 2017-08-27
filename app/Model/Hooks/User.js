'use strict'

const Hash = use('Hash')

const User = exports = module.exports = {}

/**
 * encrypts user password before saving the
 * user.
 *
 * @param {Function} next
 *
 * @yield {Function}
 */
User.encryptPassword = function * (next) {
  if (this.original.password !== this.attributes.password) {
    this.password = yield Hash.make(this.password)
  }

  yield next
}
