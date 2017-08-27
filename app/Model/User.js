'use strict'

const Base = use('App/Model/Base')

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
}

module.exports = User
