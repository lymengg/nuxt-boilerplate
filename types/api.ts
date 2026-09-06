export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  timestamp: string
}

export interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface PageParams {
  page: number
  size: number
  sort?: string
}

export interface PaginationState {
  page: number
  size: number
  sort: string
  totalElements: number
  totalPages: number
}

export interface PaginationReturn {
  state: PaginationState
  page: Ref<number>
  size: Ref<number>
  sort: Ref<string>
  totalElements: Ref<number>
  totalPages: Ref<number>
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
  onSortChange: (sort: string) => void
  reset: () => void
  updateFromResponse: (totalElements: number, totalPages: number) => void
}
