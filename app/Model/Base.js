'use strict'

const Lucid = use('Lucid')

class Base extends Lucid {

  instantiate (values) {
    super.instantiate(values)
  }

  static boot (hooks) {
    super.boot()

    this.$columns = []

    this.columnNames()

    // Hooks
    if (hooks) {
      for (let key in hooks) {
        if (typeof hooks[key] === 'string') {
          this.addHook(key, hooks[key])
        }

        if (hooks[key] instanceof Array) {
          this.defineHooks(key, hooks[key])
        }
      }
    }
  }

  static bootIfNotBooted () {
    if (this.name !== 'Base') {
      super.bootIfNotBooted()
    }
  }

  static columnNames () {
    return this.query('column_name')
      .select('column_name')
      .from('information_schema.columns')
      .where('table_name', this.table)
      .then((columns) => {
        this.$columns = columns.map(item => item.column_name)
      })
  }
}

module.exports = Base
