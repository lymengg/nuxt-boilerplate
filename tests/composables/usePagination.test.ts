import { describe, expect, it } from 'vitest'
import { usePagination } from '~/composables/usePagination'

describe('usePagination', () => {
  it('uses defaults of page 0, size 20, createdAt sort', () => {
    const pagination = usePagination()
    expect(pagination.state).toEqual({
      page: 0,
      size: 20,
      sort: 'createdAt,desc',
      totalElements: 0,
      totalPages: 0,
    })
  })

  it('accepts custom defaults', () => {
    const pagination = usePagination(50, 'name,asc')
    expect(pagination.state.size).toBe(50)
    expect(pagination.state.sort).toBe('name,asc')
  })

  it('onPageChange updates the page', () => {
    const pagination = usePagination()
    pagination.onPageChange(2)
    expect(pagination.state.page).toBe(2)
  })

  it('onSizeChange updates the size and resets the page', () => {
    const pagination = usePagination()
    pagination.onPageChange(3)
    pagination.onSizeChange(50)
    expect(pagination.state.size).toBe(50)
    expect(pagination.state.page).toBe(0)
  })

  it('onSortChange updates the sort and resets the page', () => {
    const pagination = usePagination()
    pagination.onPageChange(3)
    pagination.onSortChange('email,asc')
    expect(pagination.state.sort).toBe('email,asc')
    expect(pagination.state.page).toBe(0)
  })

  it('reset clears page and totals but keeps size and sort', () => {
    const pagination = usePagination(25, 'title,asc')
    pagination.onPageChange(4)
    pagination.updateFromResponse(100, 5)
    pagination.reset()
    expect(pagination.state.page).toBe(0)
    expect(pagination.state.totalElements).toBe(0)
    expect(pagination.state.totalPages).toBe(0)
    expect(pagination.state.size).toBe(25)
    expect(pagination.state.sort).toBe('title,asc')
  })

  it('updateFromResponse sets totals from the server', () => {
    const pagination = usePagination()
    pagination.updateFromResponse(42, 3)
    expect(pagination.state.totalElements).toBe(42)
    expect(pagination.state.totalPages).toBe(3)
  })

  it('exposes reactive refs that mirror the state', () => {
    const pagination = usePagination()
    pagination.onPageChange(1)
    expect(pagination.page.value).toBe(1)
    pagination.updateFromResponse(10, 1)
    expect(pagination.totalElements.value).toBe(10)
  })
})
