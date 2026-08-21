import type { PaginationState } from '~/types'
import { createDefaultPagination } from '~/types'

export function usePagination(initialState?: Partial<PaginationState>) {
  const state = reactive<PaginationState>({
    ...createDefaultPagination(),
    ...initialState,
  })

  function setPage(page: number) {
    state.page = page
  }

  function setSize(size: number) {
    state.size = size
    state.page = 0
  }

  function setSort(sort: string, direction?: 'asc' | 'desc') {
    if (state.sort === sort && !direction) {
      state.direction = state.direction === 'asc' ? 'desc' : 'asc'
    } else {
      state.sort = sort
      state.direction = direction || 'asc'
    }
    state.page = 0
  }

  function updateFromResponse(totalElements: number, totalPages: number) {
    state.totalElements = totalElements
    state.totalPages = totalPages
  }

  function reset() {
    Object.assign(state, createDefaultPagination())
  }

  return {
    ...toRefs(state),
    setPage,
    setSize,
    setSort,
    updateFromResponse,
    reset,
  }
}
