import { f as useRuntimeConfig } from './server.mjs';

let isRefreshing = false;
let refreshPromise = null;
let pendingRequests = [];
function getAccessToken() {
  var _a;
  return (_a = void 0 ) != null ? _a : null;
}
function setAccessToken(token) {
  return;
}
async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const config = useRuntimeConfig();
      const response = await $fetch(
        `${config.public.apiBase}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include"
        }
      );
      if (!response.success || !response.data) {
        throw new Error("Refresh failed");
      }
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}
async function processPendingRequests(token) {
  const requests = [...pendingRequests];
  pendingRequests = [];
  for (const req of requests) {
    req.resolve(token);
  }
}
async function rejectPendingRequests(error) {
  const requests = [...pendingRequests];
  pendingRequests = [];
  for (const req of requests) {
    req.reject(error);
  }
}
let cachedApiBase = null;
function getApiBase() {
  if (cachedApiBase) return cachedApiBase;
  try {
    const config = useRuntimeConfig();
    cachedApiBase = config.public.apiBase;
    return cachedApiBase;
  } catch {
    return "http://localhost:8080";
  }
}
async function apiFetch(url, options = {}) {
  var _a;
  const apiBase = getApiBase();
  const accessToken = getAccessToken();
  const headers = {
    ...options.headers
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  try {
    const response = await $fetch(url, {
      baseURL: apiBase,
      method: options.method || "GET",
      body: options.body,
      query: options.query,
      headers,
      credentials: "include"
    });
    return response;
  } catch (error) {
    const fetchError = error;
    const statusCode = fetchError.statusCode || ((_a = fetchError.response) == null ? void 0 : _a.status);
    if (statusCode === 401 && !url.includes("/auth/")) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: async (token) => {
              try {
                const retryResponse = await $fetch(url, {
                  baseURL: apiBase,
                  method: options.method || "GET",
                  body: options.body,
                  query: options.query,
                  headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`
                  },
                  credentials: "include"
                });
                resolve(retryResponse);
              } catch (retryError) {
                reject(retryError);
              }
            },
            reject
          });
        });
      }
      try {
        const newToken = await refreshAccessToken();
        await processPendingRequests(newToken);
        const retryResponse = await $fetch(url, {
          baseURL: apiBase,
          method: options.method || "GET",
          body: options.body,
          query: options.query,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`
          },
          credentials: "include"
        });
        return retryResponse;
      } catch (refreshError) {
        await rejectPendingRequests(refreshError);
        throw refreshError;
      }
    }
    throw error;
  }
}

export { apiFetch as a };
//# sourceMappingURL=api-BiGERn36.mjs.map
