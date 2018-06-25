const { isPlainObject, isFunction, isEmpty } = require('lodash')

const { buildPagination } = require('../pagination')

/**
 * @typedef {object} Collection
 * @property {number} count The total number of records available
 * @property {Array(object)} results
 */

/**
 * @typedef {object} ApiResponse
 * @property {number} count The total number of records available
 * @property {Array(object)} results
 */

/**
 * @typedef {object} TransformerOptions
 * @property {object} query an object of keys and values to be appended to the url in a pagination link, such as filter parameters
 */

/**
 * A factory function to return a transformer reponsible for transforming
 * an API response to a collection. An API response simply has results and a count
 * plus other information not needed, a collection object contains results, a count
 * information about the original query and pagination information to render a
 * collection on the page.
 *
 * @param {TransformerOptions} options
 * @param {...function} [itemTransformers] an array of transformer functions to apply for each item in the list
 * @returns {function}
 */
function transformApiResponseToCollection({ query }, ...itemTransformers) {
  /**
   * @param {ApiResponse} response API response object
   * @returns {Collection}
   */
  return function transformResponseToCollection(response) {
    if (!isPlainObject(response) || !response.results) {
      return null
    }

    let { results } = response

    itemTransformers.forEach(transformer => {
      if (!isFunction(transformer)) {
        return
      }
      results = results.map(transformer).filter(item => !isEmpty(item))
    })

    const collection = {
      results,
      count: response.count,
      pagination: buildPagination(query, response),
    }

    return collection
  }
}

module.exports = transformApiResponseToCollection
