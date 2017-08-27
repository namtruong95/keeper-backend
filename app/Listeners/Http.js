'use strict'

const Env = use('Env')
const Youch = use('youch')

const Response = use('Adonis/Src/Response')
const Database = use('Database')

const CatLog = require('cat-log')
const SqlLogger = new CatLog('sql')

const Http = exports = module.exports = {}

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function * (error, request, response) {
  const status = error.status || 500

  /**
   * DEVELOPMENT REPORTER
   */
  if (Env.get('NODE_ENV') === 'development') {
    const youch = new Youch(error, request.request)
    const type = request.accepts('json', 'html')
    const formatMethod = type === 'json' ? 'toJSON' : 'toHTML'
    const formattedErrors = yield youch[formatMethod]()
    response.status(status).send(formattedErrors)
    return
  }

  /**
   * PRODUCTION REPORTER
   */
  console.error(error.stack)
  yield response.status(status).sendView('errors/index', {error})
}

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {

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
