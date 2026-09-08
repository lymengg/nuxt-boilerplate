import { describe, expect, it } from 'vitest'
import { tenantSchema } from '~/schemas/tenant'

const validData = {
  name: 'Acme Corp',
  status: 'ACTIVE',
}

describe('tenantSchema', () => {
  describe('name', () => {
    it('accepts a valid name', async () => {
      const result = await tenantSchema.validate(validData)
      expect(result.name).toBe('Acme Corp')
    })

    it('rejects an empty name', async () => {
      await expect(
        tenantSchema.validate({ ...validData, name: '' }),
      ).rejects.toThrow('Name is required')
    })

    it('rejects a name longer than 100 characters', async () => {
      await expect(
        tenantSchema.validate({ ...validData, name: 'a'.repeat(101) }),
      ).rejects.toThrow('Name must be at most 100 characters')
    })
  })

  describe('status', () => {
    it('rejects a missing status', async () => {
      const { status: _, ...without } = validData
      await expect(tenantSchema.validate(without)).rejects.toThrow('Status is required')
    })

    it('accepts ACTIVE, INACTIVE and SUSPENDED', async () => {
      for (const status of ['ACTIVE', 'INACTIVE', 'SUSPENDED']) {
        await expect(tenantSchema.validate({ ...validData, status })).resolves.toMatchObject({ status })
      }
    })

    it('rejects an invalid status', async () => {
      await expect(
        tenantSchema.validate({ ...validData, status: 'BANNED' }),
      ).rejects.toThrow('Invalid status')
    })
  })
})
