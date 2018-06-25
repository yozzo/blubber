const { buildPagination } = require('../pagination')
const transformApiResponseToCollection = require('./transform-response-to-collection')

jest.mock('../pagination')

function nameTransformer({ id, firstName, lastName }) {
  return {
    id,
    name: `${firstName} ${lastName}`,
  }
}

function caseTransformer({ id, name }) {
  return {
    id,
    name: name.toUpperCase(),
  }
}

const testResponse = {
  count: 10,
  results: [
    {
      id: '1',
      firstName: 'Fred',
      lastName: 'Smith',
    },
    {
      id: '2',
      firstName: 'John',
      lastName: 'Doe',
    },
  ],
}

const fakePagination = {}

describe('transformApiResponseToCollection', () => {
  beforeEach(() => {
    buildPagination.mockReturnValue(fakePagination)
  })

  afterEach(() => {
    buildPagination.mockClear()
  })

  describe('when the response is null', () => {
    let transformed

    beforeEach(() => {
      transformed = transformApiResponseToCollection({
        query: 'test',
      })(null)
    })

    it('should return null', () => {
      expect(transformed).toBeNull()
    })
  })

  describe('when there are no items to transform', () => {
    let transformed

    beforeEach(() => {
      transformed = transformApiResponseToCollection({
        query: 'test',
      })({ name: 'John' })
    })

    it('should return null', () => {
      expect(transformed).toBeNull()
    })
  })

  describe('when the response is not an object', () => {
    let transformed

    beforeEach(() => {
      transformed = transformApiResponseToCollection({
        query: 'test',
      })('stuff')
    })

    it('should return null', () => {
      expect(transformed).toBeNull()
    })
  })

  describe('when there is a single transformer', () => {
    let transformed

    beforeEach(() => {
      transformed = transformApiResponseToCollection(
        {
          query: 'test',
        },
        nameTransformer
      )(testResponse)
    })

    it('should return transformed results', () => {
      expect(transformed).toHaveProperty('items')
    })

    it('should return the result count', () => {
      expect(transformed).toHaveProperty('count')
    })

    it('should create pagination', () => {
      expect(transformed).toHaveProperty('pagination', fakePagination)
    })

    it('should transform the results', () => {
      expect(transformed).toHaveProperty('items', [
        {
          id: '1',
          name: 'Fred Smith',
        },
        {
          id: '2',
          name: 'John Doe',
        },
      ])
    })
  })

  describe('when there are multiple transformers', () => {
    let transformed

    beforeEach(() => {
      transformed = transformApiResponseToCollection(
        {
          query: 'test',
        },
        nameTransformer,
        caseTransformer
      )(testResponse)
    })

    it('should return transformed results', () => {
      expect(transformed).toHaveProperty('items')
    })

    it('should return the result count', () => {
      expect(transformed).toHaveProperty('count')
    })

    it('should transform the results', () => {
      expect(transformed).toHaveProperty('items', [
        {
          id: '1',
          name: 'FRED SMITH',
        },
        {
          id: '2',
          name: 'JOHN DOE',
        },
      ])
    })
  })

  describe('when one of the transformers is not a function', () => {
    let transformed

    beforeEach(() => {
      transformed = transformApiResponseToCollection(
        {
          query: 'test',
        },
        nameTransformer,
        'what'
      )(testResponse)
    })

    it('should transform the results, ignoring the bad transformer', () => {
      expect(transformed).toHaveProperty('items', [
        {
          id: '1',
          name: 'Fred Smith',
        },
        {
          id: '2',
          name: 'John Doe',
        },
      ])
    })
  })
})
