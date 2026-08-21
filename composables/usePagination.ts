import type { PaginationReturn, PaginationState } from '~/types/api'

export function usePagination(initialSize = 20): PaginationReturn {
  const state = reactive<PaginationState>({
    page: 0,
    size: initialSize,
    sort: 'createdAt,desc',
    totalElements: 0,
    totalPages: 0,
  })

  function onPageChange(page: number) {
    state.page = page
  }

  function onSizeChange(size: number) {
    state.size = size
    state.page = 0
  }

  function onSortChange(sort: string) {
    state.sort = sort
    state.page = 0
  }

  function reset() {
    state.page = 0
    state.totalElements = 0
    state.totalPages = 0
  }

  function updateFromResponse(totalElements: number, totalPages: number) {
    state.totalElements = totalElements
    state.totalPages = totalPages
  }

  return {
    ...toRefs(state),
    state,
    onPageChange,
    onSizeChange,
    onSortChange,
    reset,
    updateFromResponse,
  }
}
