const request = require('request-promise-native')
const { authorisedRequest, _jsonReviver } = require('./authorised-request')

jest.mock('request-promise-native')

describe('authorisedRequest', () => {
  beforeEach(() => {
    request.mockResolvedValue({
      data: {
        id: '1',
        name: 'One',
      },
    })
  })

  afterEach(() => {
    request.mockClear()
  })

  describe('Simple non-authenticated call', () => {
    beforeEach(async () => {
      await authorisedRequest({
        url: 'http://www.test.com',
      })
    })

    it('should call promise native', () => {
      expect(request).toHaveBeenCalled()
    })

    it('should use the url from options', () => {
      expect(request.mock.calls[0][0]).toHaveProperty(
        'url',
        'http://www.test.com'
      )
    })

    it('to use a GET request by default', () => {
      expect(request.mock.calls[0][0]).toHaveProperty('method', 'GET')
    })

    it('should not pass in any headers', () => {
      expect(request.mock.calls[0][0]).not.toHaveProperty('headers', {})
    })
  })

  describe('Simple Authenticated call', () => {
    beforeEach(async () => {
      await authorisedRequest({
        url: 'http://www.test2.com',
        token: '1234',
      })
    })

    it('should call promise native', () => {
      expect(request).toHaveBeenCalled()
    })

    it('should use the url from options', () => {
      expect(request.mock.calls[0][0]).toHaveProperty(
        'url',
        'http://www.test2.com'
      )
    })

    it('to use a GET request by default', () => {
      expect(request.mock.calls[0][0]).toHaveProperty('method', 'GET')
    })

    it('should pass an auth header', () => {
      expect(request.mock.calls[0][0]).toHaveProperty('headers', {
        Authorization: 'Bearer 1234',
      })
    })
  })

  describe('additional query parameters', () => {
    beforeEach(async () => {
      await authorisedRequest({
        url: 'http://www.test3.com',
        token: '1234',
        qs: {
          term: 'Fred',
        },
      })
    })

    it('should pass query string parameters', () => {
      expect(request.mock.calls[0][0]).toHaveProperty('qs', {
        term: 'Fred',
      })
    })
  })

  describe('Post data to server', () => {
    beforeEach(async () => {
      await authorisedRequest({
        method: 'post',
        url: 'http://www.test3.com',
        token: '1234',
        qs: {
          term: 'Fred',
        },
        body: {
          name: 'fred',
        },
      })
    })

    it('should use the requested http method', () => {
      expect(request.mock.calls[0][0]).toHaveProperty('method', 'post')
    })

    it('should include the body to send to the server', () => {
      expect(request.mock.calls[0][0]).toHaveProperty('body', {
        name: 'fred',
      })
    })
  })

  describe('Pass additional HTTP Headers', () => {
    beforeEach(async () => {
      await authorisedRequest({
        url: 'http://www.test2.com',
        token: '1234',
        headers: {
          test_header: '999',
        },
      })
    })

    it('should pass an auth header', () => {
      expect(request.mock.calls[0][0].headers).toHaveProperty(
        'Authorization',
        'Bearer 1234'
      )
    })

    it('should pass the additional headers', () => {
      expect(request.mock.calls[0][0].headers).toHaveProperty(
        'test_header',
        '999'
      )
    })
  })

  describe('JSON Reviver', () => {
    it('should strip script out of values', () => {
      expect(_jsonReviver('name', '<script>value</script>')).toEqual('')
    })

    it('should ignore non-string fields', () => {
      expect(_jsonReviver('name', 1)).toEqual(1)
    })

    it('should allow through valid strings', () => {
      expect(_jsonReviver('name', 'Fred')).toEqual('Fred')
    })

    it('should pass the reviver function with the request', async () => {
      await authorisedRequest({
        url: 'http://www.test.com',
      })

      expect(request.mock.calls[0][0]).toHaveProperty(
        'jsonReviver',
        _jsonReviver
      )
    })
  })
})
