'use strict'

class UserController {

  static get inject () {
    return [
      'App/Model/User',
      'App/Services/Pagination',
      'App/Repositories/User'
    ]
  }

  constructor (User, Pagination, UserRepository) {
    this.User = User
    this.Pagination = Pagination
    this.UserRepository = UserRepository
  }

  * index (req, res) {
    const pagination = this.Pagination.perform(req.only('page', 'limit'))
    const filters = req.only('search', 'order')
    const result = yield this.UserRepository.list(pagination, filters)

    res.success(result)
  }
}

module.exports = UserController
