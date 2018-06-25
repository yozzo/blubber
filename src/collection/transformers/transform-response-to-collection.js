const { isPlainObject, isFunction, isEmpty } = require('lodash')

const { buildPagination } = require('../pagination')

/**
 * @param {object} [options] {object}
 * @param {object} [options.query] - URL query object used in pagination
 * @param {...function} [itemTransformers] - an array of transformer functions to apply for each item in the list
 * @returns {object, undefined}
 */
function transformApiResponseToCollection(
  { query, itemFieldName = 'results' },
  ...itemTransformers
) {
  /**
   * @param {object} response - API response object
   * @returns {function}
   */
  return function transformResponseToCollection(response) {
    if (!isPlainObject(response)) {
      return null
    }

    let items = response[itemFieldName]

    if (!items) {
      return null
    }

    itemTransformers.forEach(transformer => {
      if (!isFunction(transformer)) {
        return
      }
      items = items.map(transformer).filter(item => !isEmpty(item))
    })

    const result = {
      items,
      count: response.count,
      pagination: buildPagination(query, response),
    }

    return result
  }
}

module.exports = transformApiResponseToCollection
