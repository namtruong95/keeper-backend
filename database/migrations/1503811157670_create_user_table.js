'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 255)
      table.string('email', 255)
      table.string('password', 60)
      table.enum('role', [
        'admin',
        'member'
      ]).notNullable()
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
