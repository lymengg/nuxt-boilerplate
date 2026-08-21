import { reactive, toRefs } from 'vue';

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
    var _a, _b, _c, _d, _e, _f, _g;
    const err = error;
    const statusCode = err.statusCode || err.status || ((_a = err.response) == null ? void 0 : _a.status) || 500;
    const message = ((_b = err.data) == null ? void 0 : _b.message) || ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || err.message || "An unexpected error occurred";
    const details = ((_e = err.data) == null ? void 0 : _e.details) || ((_g = (_f = err.response) == null ? void 0 : _f.data) == null ? void 0 : _g.details);
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

export { useApiError as a, usePagination as u };
//# sourceMappingURL=useApiError-DVtejTJD.mjs.map
