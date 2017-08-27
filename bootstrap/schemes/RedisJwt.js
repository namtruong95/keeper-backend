'use strict'

const jwt = require('jsonwebtoken')
const NE = require('node-exceptions')

const JwtScheme = require('adonis-auth/src/Schemes/Jwt')

class RedisJwtScheme extends JwtScheme {

  constructor (request, serializer, options) {
    super(request, serializer, options)
    if (!options.secret) {
      throw new NE.DomainException('Add secret key to the jwt configuration block')
    }
  }

  * generate (user, payload) {
    if (!user) {
      throw new NE.InvalidArgumentException('user is required to generate a jwt token')
    }

    const primaryKey = this.serializer.primaryKey(this.options)
    const primaryValue = user[primaryKey]

    if (!primaryValue) {
      throw new NE.InvalidArgumentException(`Value for ${primaryKey} is null for given user.`)
    }

    const options = this.jwtOptions
    options.issuer = payload.issuer

    return this._signToken({ context: payload.context }, options)
  }

  * decode () {
    return yield this._verifyRequestToken(this._getRequestToken(), this.jwtOptions)
  }

  _signToken (payload, options) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.options.secret, options, function (error, token) {
        return (error) ? reject(error) : resolve(token)
      })
    })
  }

  * _getRequestUser () {
    try {
      const requestToken = yield this.decode()

      const userId = (requestToken.context && requestToken.context.user) ? requestToken.context.user.id : null
      if (!userId || !requestToken.context.jwtid) return null

      this.request.jwtPayload = requestToken
      return yield this.serializer.findById(userId, this.options)
    } catch (e) {
      return null
    }
  }

}

module.exports = RedisJwtScheme
