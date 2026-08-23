/**
 * CSRF / Origin validation middleware — protects state-changing requests
 * (POST, PUT, PATCH, DELETE) against cross-origin attacks.
 *
 * Strategy:
 * 1. Validate the `Origin` header against the configured trusted frontend origin.
 * 2. Reject unexpected cross-origin state-changing requests.
 * 3. Use Fetch Metadata headers (Sec-Fetch-Site, Sec-Fetch-Mode, Sec-Fetch-Dest)
 *    as additional signals where available.
 * 4. Safe methods (GET, HEAD, OPTIONS) are never blocked.
 *
 * SameSite=Strict cookies provide the primary CSRF defense. This middleware
 * adds a centralized second layer of defense.
 */
export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // Safe methods never need CSRF protection
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return
  }

  // Only protect state-changing methods
  if (method !== 'POST' && method !== 'PUT' && method !== 'PATCH' && method !== 'DELETE') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const config = useRuntimeConfig()

  // Build list of allowed origins from config + server origin
  const serverOrigin = getRequestURL(event).origin
  const allowedOrigins = new Set<string>([serverOrigin])

  if (config.allowedOrigins) {
    for (const origin of config.allowedOrigins.split(',').map(s => s.trim()).filter(Boolean)) {
      allowedOrigins.add(origin)
    }
  }

  // Validate Origin header
  const origin = getHeader(event, 'origin')

  if (origin) {
    if (!allowedOrigins.has(origin)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cross-origin request rejected',
      })
    }
  }

  // Validate Fetch Metadata headers where available
  const secFetchSite = getHeader(event, 'sec-fetch-site')
  const secFetchMode = getHeader(event, 'sec-fetch-mode')
  const secFetchDest = getHeader(event, 'sec-fetch-dest')

  // Same-origin requests: Sec-Fetch-Site should be 'same-origin' or 'none' (direct)
  // Cross-origin requests from the browser: Sec-Fetch-Site should be 'same-site' or 'cross-site'
  if (secFetchSite === 'cross-site') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cross-site request rejected',
    })
  }

  // Navigation requests (form submissions, links) should not reach API endpoints
  if (secFetchMode === 'navigate' && secFetchDest === 'document') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Navigation request to API endpoint rejected',
    })
  }
})
