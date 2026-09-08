import { describe, expect, it } from 'vitest'
import { useFormat } from '~/composables/useFormat'

const { formatCurrency, formatDate, formatDateTime } = useFormat()

describe('useFormat', () => {
  describe('formatCurrency', () => {
    it('formats an amount in USD by default', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })

    it('formats cents', () => {
      expect(formatCurrency(25.5)).toBe('$25.50')
    })

    it('formats with a custom currency', () => {
      expect(formatCurrency(10, 'EUR')).toBe('€10.00')
    })

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    it('formats an ISO date', () => {
      expect(formatDate('2024-01-01T00:00:00Z')).toBe('Jan 1, 2024')
    })

    it('formats a date-only string', () => {
      expect(formatDate('2024-06-15')).toBe('Jun 15, 2024')
    })
  })

  describe('formatDateTime', () => {
    it('formats an ISO datetime with a time component', () => {
      // The wall-clock value depends on the machine timezone; assert the
      // date + a time pattern instead of a fixed clock time.
      const result = formatDateTime('2024-01-01T09:30:00Z')
      expect(result).toContain('2024')
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/)
    })
  })
})
