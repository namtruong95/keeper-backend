'use strict'

const coFs = require('co-functional')
const Auth = require('adonis-auth/middleware/Auth')

const Antl = use('Antl')
const Exceptions = use('App/Exceptions')
const Credential = use('App/Model/Credential')
const JwtTokenService = use('App/Services/JwtToken')

class JwtAuth extends Auth {

  * _authenticate (request, authenticators) {
    try {
      yield this._tryFail(request, authenticators)

      if (request.jwtPayload &&
          [Credential.ISSUERS.COMPANY_ACCOUNT, Credential.ISSUERS.INVITATION].indexOf(request.jwtPayload.iss) > -1) {
        throw new Exceptions.ApplicationException(Antl.get('common.errors.verification_not_found'), 400)
      }

      throw new Exceptions.ApplicationException(Antl.get('common.errors.expired_session'), 401)
    } catch (e) {
      if (e.message !== 'Stop execution') {
        throw e
      }
    }
  }

  _tryFail (request, authenticators) {
    return coFs.forEachSerial(function * (authenticator) {
      /**
       * it should make use of existing of existing auth instance when
       * authenticator is set to default. It will avoid invoking new
       * instance, which inturn saves a SQL query.
       */
      const authInstance = authenticator === 'default' ? request.auth : request.auth.authenticator(authenticator)
      const result = yield authInstance.check()

      if (result) {
        // Filter blacklist sessions
        const jwtPayload = request.jwtPayload

        if (jwtPayload && jwtPayload.iss === Credential.ISSUERS.LOGIN) {
          const isRevoked = yield JwtTokenService.isRevokedToken(jwtPayload.context.user.id, jwtPayload.context.jwtid)

          if (isRevoked) return
        }

        request.authUser = yield authInstance.getUser()
        /**
         * we need to break the loop as soon as an authenticator
         * returns true. Ideally one cannot break promises chain
         * without throwing an error, so here we throw an error
         * and handle it gracefully
         */
        throw new Error('Stop execution')
      }
    }, authenticators)
  }

}

module.exports = JwtAuth
