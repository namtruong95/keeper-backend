'use strict'

const Antl = use('Antl')

const ExceptionParser = module.exports = exports = {}

/**
 * handlers is the list of custom handlers to handle exceptions.
 * For example throw new ValidationException can be handled
 * using ValidationException function on the handlers
 * object.
 *
 * @type {Object}
 */
const handlers = {
  ApplicationException: function (error, request, response) {
    const status = error.status || 400
    response.status(status).json({ message: error.message })
  },

  ValidationException: function (error, request, response) {
    const status = 422
    const fields = error.fields
    const message = error.message

    response.status(status).json({ message, fields })
  },

  /* eslint handle-callback-err: "off" */
  RequestEntityTooLarge: function (error, request, response) {
    const status = error.status || 400
    response.status(status).json({ message: Antl.get('attachments.file_too_large') })
  },

  HttpException: function (error, request, response) {
    const status = error.status || 404
    response.status(status).json({ message: error.message })
  },

  InvalidLoginException: function (error, request, response) {
    response.status(error.status).json({ message: Antl.get('common.errors.expired_session') })
  },

  default: function (error, request, response) {
    const message = Antl.get('common.errors.unexpected_error')
    const status = error.status || 500

    response.status(status).json({ message })
  }
}

/**
 * send method is used to make the final user friendly error
 * and send it back to the user/browser.
 *
 * @param      {Object}  error     The error
 * @param      {Object}  request   The request
 * @param      {Object}  response  The response
 *
 * @public
 */
ExceptionParser.send = (error, request, response) => {
  const handler = handlers[error.name] || handlers.default

  // Log error on development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(error, error.message)
  }

  handler(error, request, response)
}
