export interface PaginationState {
  page: number
  size: number
  sort: string
  direction: 'asc' | 'desc'
  totalElements: number
  totalPages: number
}

export function createDefaultPagination(): PaginationState {
  return {
    page: 0,
    size: 20,
    sort: 'createdAt',
    direction: 'desc',
    totalElements: 0,
    totalPages: 0,
  }
}
