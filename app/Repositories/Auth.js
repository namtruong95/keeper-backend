'use strict'

const Exceptions = use('App/Exceptions')
const Antl = use('Antl')
const Hash = use('Hash')

class AuthRepository {

  static get inject () {
    return [
      'App/Model/User'
    ]
  }

  constructor (User) {
    this.User = User
  }

  * findViaCredentials (email, password) {
    const user = yield this.User
      .query()
      .where('email', email)
      .first()

    if (!user) {
      throw new Exceptions.ApplicationException(Antl.get('auth.bad_credentials'), 400)
    }

    let isMatchedPassword = yield Hash.verify(password, user.password)

    if (!isMatchedPassword) {
      throw new Exceptions.ApplicationException(Antl.get('auth.bad_credentials'), 400)
    }

    return user
  }

}

module.exports = AuthRepository
