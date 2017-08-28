'use strict'

const jwt = require('jsonwebtoken')

const Env = use('Env')
const Redis = use('Redis')
const CatLog = require('cat-log')
const Logger = new CatLog('jwt:token')

const Credential = use('App/Model/Credential')

const JwtTokenService = module.exports = exports = {}

JwtTokenService.revokeToken = function (userId, tokenId, lifetime) {
  const key = `blacklist:${userId}`
  Redis.hmset(key, tokenId, 1, (err, result) => {
    if (err) {
      Logger.error(err.message)
    } else {
      Redis.expire(key, lifetime)
    }
  })
}

JwtTokenService.isRevokedToken = function * (userId, tokenId) {
  const key = `blacklist:${userId}`

  return new Promise((resolve, reject) => {
    Redis.hgetall(key, (err, result) => {
      return resolve((err || result[userId] || result[tokenId]))
    })
  })
}
