'use strict'

const Event = use('Event')
const Database = use('Database')

class AccountRepository {

  static get inject () {
    return [
      'App/Model/Account'
    ]
  }

  constructor (Account) {
    this.Account = Account
  }

  * list (userId, pagination, filters) {
    const accounts = this.Account
      .query()
      .where('user_id', userId)
      .where('deleted_at', null)

    // Search result
    if (typeof filters.search === 'string') {
      accounts.whereRaw(
        `("title" ILIKE '%${filters.search}%' OR "username" ILIKE '%${filters.search}%')`
      )
    }

    return yield accounts.paginate(pagination.page, pagination.limit)
  }

  * store (userId, payload) {
    const account = new this.Account()

    account.title = payload.title
    account.username = payload.username
    account.password = payload.password
    account.user_id = userId

    yield account.save()

    const freshInstance = yield account.fresh()
    Event.fire('account:created', freshInstance)
    return freshInstance
  }

  * findOrFail (userId, accountId) {
    const account = yield this.Account
      .query()
      .where('id', accountId)
      .where('user_id', userId)
      .first()

    if (!account) return this.Account.notFound()

    return account
  }

  * update (userId, accountId, payload) {
    const account = yield this.findOrFail(userId, accountId)

    account.title = payload.title
    account.username = payload.username
    account.password = payload.password
    yield account.save()

    return account
  }

  * destroy(userId, accountId) {
    const account = yield this.findOrFail(userId, accountId)

    return yield account.delete()
  }

}

module.exports = AccountRepository
