/**
 * Security headers middleware — applies OWASP-recommended headers to every
 * response from the Nuxt server. These mitigate common frontend attack vectors:
 *
 * - CSP: prevents XSS, data exfiltration, and inline script injection.
 * - X-Frame-Options: clickjacking (frame embedding).
 * - X-Content-Type-Options: MIME-type sniffing.
 * - Referrer-Policy: referrer leakage to third parties.
 * - Permissions-Policy: locks down browser APIs (camera, mic, geolocation).
 * - Strict-Transport-Security: forces HTTPS (only sent over HTTPS in prod).
 * - X-DNS-Prefetch-Control: disables DNS prefetching for sensitive apps.
 *
 * In development, CSP is set to report-only so the app doesn't break while
 * you iterate. In production, it's enforced.
 */
export default defineEventHandler(async (event) => {
  const isDev = process.env.NODE_ENV !== 'production'

  // Content-Security-Policy — locks resources to same-origin + approved CDNs.
  // 'unsafe-inline' for styles is needed because PrimeVue/Tailwind inject
  // inline styles. No 'unsafe-inline' for scripts.
  const cspDirectives = [
    "default-src 'self'",
    // Google Fonts (CSS + fonts) — loaded in nuxt.config.ts head.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    // No external script sources allowed.
    "script-src 'self'",
    // Images: self + data URIs (PrimeVue uses them for some icons).
    "img-src 'self' data: https:",
    // No external connections (fetch, WebSocket, EventSource) — BFF is same-origin.
    "connect-src 'self'",
    // No frames, no objects, no plugins.
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Restrict URI leaking on violations (report to a same-origin endpoint).
    "report-uri /api/csp-report",
  ].join('; ')

  setHeader(event, isDev ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy', cspDirectives)

  // Clickjacking — deny all frame embedding (stronger than CSP frame-ancestors
  // for older browsers).
  setHeader(event, 'X-Frame-Options', 'DENY')

  // MIME sniffing — prevent browser from interpreting files as a different type.
  setHeader(event, 'X-Content-Type-Options', 'nosniff')

  // Referrer — only send origin to cross-origin destinations, full URL same-origin.
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy — disable browser APIs the app doesn't use.
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')

  // HSTS — only over HTTPS; instructs browser to always use HTTPS for this origin.
  if (!isDev) {
    setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  // DNS prefetch — disable to prevent leaking DNS queries to third parties.
  setHeader(event, 'X-DNS-Prefetch-Control', 'off')

  // CORS — the BFF is same-origin, so no CORS headers needed. If the app is
  // ever served from a different origin than the BFF, add explicit CORS config
  // here rather than relying on wildcard.
})
