/**
 * HTTP method and request limits middleware.
 *
 * Restricts supported HTTP methods, enforces body-size limits, and
 * limits excessive query-string parameters.
 *
 * Applied as server middleware before routes to reject oversized or
 * unsupported requests early.
 */

/** Maximum request body size: 10 MB (covers most file uploads). */
const MAX_BODY_SIZE = 10 * 1024 * 1024

/** Maximum number of query parameters. */
const MAX_QUERY_PARAMS = 50

/** Maximum query-string length. */
const MAX_QUERY_LENGTH = 2048

/** Supported HTTP methods. */
const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // Reject unsupported HTTP methods
  if (!ALLOWED_METHODS.has(method)) {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  // Validate query string length and parameter count
  const queryString = getRequestURL(event).search
  if (queryString.length > MAX_QUERY_LENGTH) {
    throw createError({ statusCode: 414, statusMessage: 'Query string too long' })
  }

  const query = getQuery(event)
  const queryKeys = Object.keys(query)
  if (queryKeys.length > MAX_QUERY_PARAMS) {
    throw createError({ statusCode: 400, statusMessage: 'Too many query parameters' })
  }

  // Body-size limit for methods that typically include a body.
  // Nitro enforces body parsing limits via the route body parser;
  // this is an additional safety check for the Content-Length header.
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    const contentLength = getHeader(event, 'content-length')
    if (contentLength && Number.parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      throw createError({ statusCode: 413, statusMessage: 'Request body too large' })
    }
  }
})
