import { describe, expect, it } from 'vitest'
import { departmentSchema } from '~/schemas/department'

const validData = {
  name: 'Engineering',
  tenantId: 1,
}

describe('departmentSchema', () => {
  describe('name', () => {
    it('accepts a valid name', async () => {
      const result = await departmentSchema.validate(validData)
      expect(result.name).toBe('Engineering')
    })

    it('rejects an empty name', async () => {
      await expect(
        departmentSchema.validate({ ...validData, name: '' }),
      ).rejects.toThrow('Name is required')
    })

    it('rejects a name longer than 100 characters', async () => {
      await expect(
        departmentSchema.validate({ ...validData, name: 'a'.repeat(101) }),
      ).rejects.toThrow('Name must be at most 100 characters')
    })

    it('trims surrounding whitespace', async () => {
      const result = await departmentSchema.validate({ ...validData, name: '  Engineering  ' })
      expect(result.name).toBe('Engineering')
    })
  })

  describe('tenantId', () => {
    it('rejects a missing tenantId', async () => {
      const { tenantId: _, ...without } = validData
      await expect(departmentSchema.validate(without)).rejects.toThrow('Tenant is required')
    })

    it('rejects a non-numeric tenantId', async () => {
      await expect(
        departmentSchema.validate({ ...validData, tenantId: 'abc' }),
      ).rejects.toThrow('Tenant is required')
    })
  })

  describe('managerIds', () => {
    it('defaults to an empty array', async () => {
      const result = await departmentSchema.validate(validData)
      expect(result.managerIds).toEqual([])
    })

    it('accepts a list of manager ids', async () => {
      const result = await departmentSchema.validate({ ...validData, managerIds: [1, 2, 3] })
      expect(result.managerIds).toEqual([1, 2, 3])
    })

    it('rejects a non-numeric manager id', async () => {
      await expect(
        departmentSchema.validate({ ...validData, managerIds: [1, 'x'] }),
      ).rejects.toThrow()
    })
  })
})
