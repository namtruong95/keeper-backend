'use strict'

const Validator = use('Validator')

class AccountController {
  static get inject () {
    return [
      'App/Model/Account',
      'App/Services/Pagination',
      'App/Repositories/Account'
    ]
  }

  constructor (Account, Pagination, AccountRepository) {
    this.Account = Account
    this.Pagination = Pagination
    this.AccountRepository = AccountRepository
  }

  * index (req, res) {
    const pagination = this.Pagination.perform(req.only('page', 'limit'))
    const filters = req.only('search', 'order')
    const result = yield this.AccountRepository.list(req.currentUser.id, pagination, filters)

    res.success(result)
  }

  * store (req, res) {
    const input = Validator.sanitize(
        req.only('title', 'username', 'password'),
        this.Account.sanitizationRules
    )

    yield Validator.quickValidate(
      input,
      this.Account.accountRules,
      this.Account.validationMessages
    )

    const account = yield this.AccountRepository.store(req.currentUser.id, input)
    res.success(account)
  }

  * show (req, res) {
    const account = yield this.AccountRepository.findOrFail(req.currentUser.id, req.param('account_id'))
    res.success(account)
  }

  * update (req, res) {
    const input = Validator.sanitize(
      req.only('title', 'username', 'password'),
       this.Account.sanitizationRules
      )
    yield Validator.quickValidate(
      input,
      this.Account.accountRules,
      this.Account.validationMessages
    )

    const account = yield this.AccountRepository.update(req.currentUser.id, req.param('account_id'), input)
    res.success(account)
  }

  * destroy (req, res) {
    yield this.AccountRepository.destroy(req.currentUser.id, req.param('account_id'))
    res.success({ success: true })
  }
}

module.exports = AccountController
