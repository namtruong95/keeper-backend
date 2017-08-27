'use strict'

const Lucid = use('Lucid')

class Credential extends Lucid {
  static get ISSUERS () {
    return {
      LOGIN: 'oauth:login'
    }
  }
}

module.exports = Credential
