const { range, take, get, omitBy } = require('lodash')
const queryString = require('qs')

const config = {
  paginationMaxResults: 10000,
}

function getPageLink(page, query = {}) {
  const newQuery = {
    ...query,
    page,
  }

  return `?${queryString.stringify(omitBy(newQuery, val => val === ''))}`
}

function truncatePages(pagination, blockSize) {
  const TRUNCATION_SYMBOL = '…'
  const { pages } = pagination

  if (pages.length <= blockSize) {
    return pagination
  }

  const currentPageNum = pagination.currentPage
  const currentPageIndex = pagination.currentPage - 1
  const firstPage = pages[0]
  const lastPage = pages[pages.length - 1]

  const blockPivot = Math.round(blockSize / 2)
  const startOfCurrentBlock = Math.abs(currentPageNum - blockPivot)
  const startOfLastBlock = lastPage.label - blockSize
  const blockStartIndex = Math.min(
    startOfCurrentBlock,
    startOfLastBlock,
    currentPageIndex
  )

  const truncatedPages = take(pages.slice(blockStartIndex), blockSize)
  const firstOfTruncatedPagesNum = truncatedPages[0].label
  const lastOfTruncatedPagesNum =
    truncatedPages[truncatedPages.length - 1].label

  if (firstOfTruncatedPagesNum > 3) {
    truncatedPages.unshift({ label: TRUNCATION_SYMBOL })
  }
  if (firstOfTruncatedPagesNum === 3) {
    truncatedPages.unshift(pages[1])
  }
  if (firstOfTruncatedPagesNum > 1) {
    truncatedPages.unshift(firstPage)
  }
  if (lastOfTruncatedPagesNum < lastPage.label - 2) {
    truncatedPages.push({ label: TRUNCATION_SYMBOL })
  }

  if (lastOfTruncatedPagesNum === lastPage.label - 2) {
    truncatedPages.push(pages[pages.length - 2])
  }
  if (lastOfTruncatedPagesNum < lastPage.label) {
    truncatedPages.push(lastPage)
  }

  return {
    ...pagination,
    pages: truncatedPages,
  }
}

function buildPagination(query = {}, results, truncate = 4) {
  const limit =
    results.limit || Math.max(get(results, 'results.length', 10), 10)
  const totalPages = results.count ? Math.ceil(results.count / limit) : 0
  const totalPagesLimited = Math.round(
    Math.min(totalPages, config.paginationMaxResults / limit)
  )

  const parseResults = {
    ...results,
    page: parseInt(query.page, 10) || 1,
  }

  if (totalPages < 2) {
    return null
  }

  const pages = range(0, totalPagesLimited).map((page, idx) => ({
    label: idx + 1,
    url: getPageLink(idx + 1, query),
  }))

  const pagination = {
    pages,
    totalPages: totalPagesLimited,
    currentPage: parseResults.page,
    prev:
      parseResults.page > 1 ? getPageLink(parseResults.page - 1, query) : null,
    next:
      parseResults.page === totalPages
        ? null
        : getPageLink(parseResults.page + 1, query),
  }

  return truncatePages(pagination, truncate)
}

module.exports = {
  getPageLink,
  buildPagination,
}
