const { pickBy, set } = require('lodash')
const request = require('request-promise-native')

function stripScript(text) {
  let parsedText = text
  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  while (SCRIPT_REGEX.test(parsedText)) {
    parsedText = text.replace(SCRIPT_REGEX, '')
  }
  return parsedText
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

function authorisedRequest({
  token,
  url,
  headers,
  method = 'GET',
  qs,
  body,
  json = true,
}) {
  const requestOptions = pickBy({
    body,
    headers,
    json,
    jsonReviver,
    method,
    qs,
    url,
  })

  if (token) {
    set(requestOptions, 'headers.Authorization', `Bearer ${token}`)
  }

  return request(requestOptions)
}

module.exports = {
  authorisedRequest,
  _jsonReviver: jsonReviver,
}
