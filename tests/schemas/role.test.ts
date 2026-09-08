import { describe, expect, it } from 'vitest'
import { roleSchema } from '~/schemas/role'

const validData = {
  name: 'EXPENSE_MANAGER',
  title: 'Expense Manager',
  description: 'Manages expenses',
}

describe('roleSchema', () => {
  describe('name', () => {
    it('accepts a valid name', async () => {
      const result = await roleSchema.validate(validData)
      expect(result.name).toBe('EXPENSE_MANAGER')
    })

    it('rejects an empty name', async () => {
      await expect(
        roleSchema.validate({ ...validData, name: '' }),
      ).rejects.toThrow('Name is required')
    })

    it('rejects a name longer than 50 characters', async () => {
      await expect(
        roleSchema.validate({ ...validData, name: 'a'.repeat(51) }),
      ).rejects.toThrow('Name must be at most 50 characters')
    })

    it('rejects names with special characters', async () => {
      await expect(
        roleSchema.validate({ ...validData, name: 'BAD NAME!' }),
      ).rejects.toThrow('Name may only contain letters, numbers and underscores')
    })

    it('accepts names with underscores', async () => {
      const result = await roleSchema.validate({ ...validData, name: 'MY_ROLE_1' })
      expect(result.name).toBe('MY_ROLE_1')
    })
  })

  describe('title', () => {
    it('defaults to an empty string', async () => {
      const { title: _, ...without } = validData
      const result = await roleSchema.validate(without)
      expect(result.title).toBe('')
    })

    it('rejects a title longer than 100 characters', async () => {
      await expect(
        roleSchema.validate({ ...validData, title: 'a'.repeat(101) }),
      ).rejects.toThrow('Title must be at most 100 characters')
    })
  })

  describe('description', () => {
    it('defaults to an empty string', async () => {
      const { description: _, ...without } = validData
      const result = await roleSchema.validate(without)
      expect(result.description).toBe('')
    })

    it('rejects a description longer than 255 characters', async () => {
      await expect(
        roleSchema.validate({ ...validData, description: 'a'.repeat(256) }),
      ).rejects.toThrow('Description must be at most 255 characters')
    })
  })
})
