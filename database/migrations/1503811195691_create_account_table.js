'use strict'

const Schema = use('Schema')

class AccountsTableSchema extends Schema {

  up () {
    this.create('accounts', (table) => {
      table.increments()
      table.string('title', 255)
      table.string('username', 255)
      table.string('password', 60)
      table.integer('user_id')
      table.index('user_id')
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('accounts')
  }

}

module.exports = AccountsTableSchema
