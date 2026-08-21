import { reactive, toRefs } from "vue";
function createDefaultPagination() {
  return {
    page: 0,
    size: 20,
    sort: "createdAt",
    direction: "desc",
    totalElements: 0,
    totalPages: 0
  };
}
function usePagination(initialState) {
  const state = reactive({
    ...createDefaultPagination(),
    ...initialState
  });
  function setPage(page) {
    state.page = page;
  }
  function setSize(size) {
    state.size = size;
    state.page = 0;
  }
  function setSort(sort, direction) {
    if (state.sort === sort && !direction) {
      state.direction = state.direction === "asc" ? "desc" : "asc";
    } else {
      state.sort = sort;
      state.direction = direction || "asc";
    }
    state.page = 0;
  }
  function updateFromResponse(totalElements, totalPages) {
    state.totalElements = totalElements;
    state.totalPages = totalPages;
  }
  function reset() {
    Object.assign(state, createDefaultPagination());
  }
  return {
    ...toRefs(state),
    setPage,
    setSize,
    setSort,
    updateFromResponse,
    reset
  };
}
function useApiError() {
  function handleError(error) {
    const err = error;
    const statusCode = err.statusCode || err.status || err.response?.status || 500;
    const message = err.data?.message || err.response?.data?.message || err.message || "An unexpected error occurred";
    const details = err.data?.details || err.response?.data?.details;
    return { statusCode, message, details };
  }
  function getFieldErrors(error) {
    const apiError = handleError(error);
    const fieldErrors = {};
    if (apiError.details) {
      for (const [field, messages] of Object.entries(apiError.details)) {
        fieldErrors[field] = messages[0];
      }
    }
    return fieldErrors;
  }
  function getPermissionDeniedMessage() {
    return "You do not have permission to perform this action.";
  }
  function getNotFoundMessage(resource) {
    return `${resource} not found.`;
  }
  function getServerErrorMessage() {
    return "The server is temporarily unavailable. Please try again later.";
  }
  return {
    handleError,
    getFieldErrors,
    getPermissionDeniedMessage,
    getNotFoundMessage,
    getServerErrorMessage
  };
}
export {
  useApiError as a,
  usePagination as u
};
//# sourceMappingURL=useApiError-DVtejTJD.js.map
