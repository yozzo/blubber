const { pick, set } = require('lodash')
const request = require('request-promise-native')

const defaultOptions = {
  json: true,
  method: 'GET',
}

function stripScript(text) {
  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  while (SCRIPT_REGEX.test(text)) {
    console.warn('Found script tag in response')
    text = text.replace(SCRIPT_REGEX, '')
  }
  return text
}

function isString(s) {
  return typeof s === 'string' || s instanceof String
}

// Called for each key value in a json response, strips out any script tags.
function jsonReviver(key, value) {
  if (isString(value)) {
    return stripScript(value)
  }
  return value
}

module.exports = opts => {
  const requestOptions = {
    ...defaultOptions,
    ...pick(opts, ['url', 'headers', 'method', 'qs', 'body']),
  }

  if (opts.token) {
    set(requestOptions, 'headers.Authorization', `Bearer ${opts.token}`)
  }

  requestOptions.jsonReviver = jsonReviver

  return request(requestOptions)
}
