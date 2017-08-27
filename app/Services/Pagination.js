'use strict'

const Pagination = exports = module.exports = {}

Pagination.perform = function (data) {
  let page = parseInt(data.page)
  let limit = parseInt(data.limit)

  if (isNaN(page) || page < 1) {
    page = 1
  }

  if (isNaN(limit) || limit <= 0) {
    limit = 20
  }

  if (limit > 50) {
    limit = 50
  }

  return {
    page: page,
    limit: limit
  }
}

Pagination.performHistory = function (data) {
  let beforeId = parseInt(data.before)
  let afterId = parseInt(data.after)
  let limit = parseInt(data.limit)

  if (isNaN(beforeId) || beforeId < 1) {
    beforeId = null
  }

  if (isNaN(afterId) || afterId < 1) {
    afterId = null
  }

  if (isNaN(limit) || limit <= 0) {
    limit = 20
  }

  if (limit > 50) {
    limit = 50
  }

  return { beforeId, afterId, limit }
}
