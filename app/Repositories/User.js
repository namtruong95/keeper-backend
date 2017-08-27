'use strict'

class UserRepository {

  static get inject () {
    return [
      'App/Model/User'
    ]
  }

  constructor (User) {
    this.User = User
  }

  * list (pagination, filters) {
    const users = this.User
      .query()

    // Search result
    if (typeof filters.search === 'string') {
      users.where('name', 'ILIKE', `%${filters.search}%`)
    }

    return yield users.paginate(pagination.page, pagination.limit)
  }
}

module.exports = UserRepository
