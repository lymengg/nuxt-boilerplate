/**
 * CSP violation report endpoint — receives Content-Security-Policy violation
 * reports from the browser and logs them server-side.
 *
 * Hardening:
 * - Body-size limited by Nitro (default 1 MB for JSON)
 * - Rate limited: max 10 reports per minute per IP
 * - Payload validation: only expected CSP report fields are logged
 * - No credentials or auth headers logged
 * - Log-injection safe: all values are JSON-serialized
 */

/** Simple in-memory rate limiter for CSP reports. */
const reportCounts = new Map<string, { count: number, resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 10

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = reportCounts.get(ip)

  if (!entry || now > entry.resetAt) {
    reportCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

/** Fields we accept from a CSP report (subset of the CSP Reporting API). */
interface CspReport {
  'document-uri'?: string
  'referrer'?: string
  'violated-directive'?: string
  'effective-directive'?: string
  'original-policy'?: string
  'disposition'?: string
  'blocked-uri'?: string
  'status-code'?: number
  'script-sample'?: string
}

export default defineEventHandler(async (event) => {
  // Rate limiting
  const ip = getRequestHeader(event, 'x-forwarded-for')
    || getRequestHeader(event, 'x-real-ip')
    || 'unknown'

  if (isRateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many reports' })
  }

  const method = getMethod(event)
  if (method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  let report: CspReport
  try {
    report = await readBody<CspReport>(event)
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  if (!report || typeof report !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid report format' })
  }

  // Sanitize and log the report — never log credentials or auth headers
  const sanitized = {
    timestamp: new Date().toISOString(),
    documentUri: truncate(report['document-uri'], 500),
    violatedDirective: truncate(report['violated-directive'], 200),
    effectiveDirective: truncate(report['effective-directive'], 200),
    blockedUri: truncate(report['blocked-uri'], 500),
    disposition: report.disposition,
    statusCode: report['status-code'],
    scriptSample: truncate(report['script-sample'], 200),
    referrer: truncate(report.referrer, 500),
  }

  console.error(JSON.stringify({ event: 'CSP_VIOLATION', ...sanitized }))

  return { success: true }
})

function truncate(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined
  return value.length > maxLength ? value.slice(0, maxLength) : value
}
