const request = require('request-promise-native')
const authorisedRequest = require('./authorised-request')

jest.mock('request-promise-native')

describe('authorisedRequest', () => {
  describe('simple non-authenticated call', () => {
    beforeEach(async () => {
      request.mockResolvedValue({
        data: {
          id: '1',
          name: 'One',
        },
      })

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
})
