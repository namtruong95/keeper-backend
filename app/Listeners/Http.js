'use strict'

const Env = use('Env')
const Youch = use('youch')

const Response = use('Adonis/Src/Response')
const Database = use('Database')

const CatLog = require('cat-log')
const SqlLogger = new CatLog('sql')

const ExceptionParser = use('App/Services/ExceptionParser')

const Http = exports = module.exports = {}

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function * (error, request, response) {
  ExceptionParser.send(error, request, response)
}

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {
  use('App/Services/Validator').extendValidator()
    /**
   * Response macros
   */
  Response.macro('success', function (data) {
    this.status(200).json(data)
  })

  Response.macro('created', function (data) {
    this.status(201).json(data)
  })

  Response.macro('error', function (message) {
    this.status(422).json({ message: message })
  })

  Database.on('sql', SqlLogger.info.bind(SqlLogger))
}
