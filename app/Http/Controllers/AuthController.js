'use strict'

const Validator = use('Validator')

class AuthController {

  static get inject () {
    return [
      'App/Model/User',
      'App/Model/Credential',
      'App/Services/JwtToken',
      'App/Repositories/Auth'
    ]
  }

  constructor (User, Credential, JwtTokenService, AuthRepository) {
    this.User = User
    this.Credential = Credential
    this.JwtTokenService = JwtTokenService
    this.AuthRepository = AuthRepository
  }

  * login (req, res) {
    const input = Validator.sanitize(req.only('email', 'password'), this.User.sanitizationRules)
    yield Validator.quickValidate(input, this.User.loginRules, this.User.validationMessages)

    const user = yield this.AuthRepository.findViaCredentials(input.email, input.password)
    const userData = user.toLoginJSON()

    const accessToken = yield req.auth.generate(user, {
      issuer: this.Credential.ISSUERS.LOGIN,
      context: {
        user: userData,
        jwtid: use('uuid').v1()
      }
    })

    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 7)

    res.success({
      token_type: 'Bearer',
      access_token: accessToken,
      expires_in: 604800, // 1 * 7 * 24 * 60 * 60 * 1000 -> 1 week
      expires_on: expiry
    })
  }
}

module.exports = AuthController
