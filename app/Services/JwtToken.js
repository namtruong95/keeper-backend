'use strict'

const jwt = require('jsonwebtoken')
const Env = use('Env')

const CatLog = require('cat-log')
const Logger = new CatLog('jwt:token')

const Credential = use('App/Model/Credential')

const JwtTokenService = module.exports = exports = {}

JwtTokenService.isRevokedToken = function * (userId, tokenId) {
  const key = `blacklist:${userId}`

  return new Promise((resolve, reject) => {
    Redis.hgetall(key, (err, result) => {
      return resolve((err || result[userId] || result[tokenId]))
    })
  })
}

JwtTokenService.generateNewAccountToken = function (payload = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: '7d',
      issuer: Credential.ISSUERS.LOGIN
    }

    jwt.sign({ context: payload.context }, process.env.APP_KEY || 'n96M1TPG821EdN4mMIjnGKxGytx9W2UJ', options, function (error, token) {
      if (error) {
        return reject(error)
      }
      resolve(token)
    })
  })
}
