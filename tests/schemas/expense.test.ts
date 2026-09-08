import { describe, expect, it } from 'vitest'
import { expenseSchema } from '~/schemas/expense'
import { EXPENSE_CATEGORIES } from '~/types/expense'

const validData = {
  title: 'Client lunch',
  description: 'Business meeting',
  amount: 25.5,
  category: EXPENSE_CATEGORIES[0],
}

describe('expenseSchema', () => {
  describe('title', () => {
    it('accepts a valid title', async () => {
      const result = await expenseSchema.validate(validData)
      expect(result.title).toBe('Client lunch')
    })

    it('rejects an empty title', async () => {
      await expect(
        expenseSchema.validate({ ...validData, title: '' }),
      ).rejects.toThrow('Title is required')
    })

    it('rejects a title longer than 200 characters', async () => {
      await expect(
        expenseSchema.validate({ ...validData, title: 'a'.repeat(201) }),
      ).rejects.toThrow('Title must be at most 200 characters')
    })
  })

  describe('description', () => {
    it('defaults to an empty string', async () => {
      const { description: _, ...without } = validData
      const result = await expenseSchema.validate(without)
      expect(result.description).toBe('')
    })

    it('rejects a description longer than 1000 characters', async () => {
      await expect(
        expenseSchema.validate({ ...validData, description: 'a'.repeat(1001) }),
      ).rejects.toThrow('Description must be at most 1000 characters')
    })
  })

  describe('amount', () => {
    it('rejects a missing amount', async () => {
      const { amount: _, ...without } = validData
      await expect(expenseSchema.validate(without)).rejects.toThrow('Amount is required')
    })

    it('rejects a non-numeric amount', async () => {
      await expect(
        expenseSchema.validate({ ...validData, amount: 'abc' }),
      ).rejects.toThrow('Amount is required')
    })

    it('rejects zero', async () => {
      await expect(
        expenseSchema.validate({ ...validData, amount: 0 }),
      ).rejects.toThrow('Amount must be greater than 0')
    })

    it('rejects a negative amount', async () => {
      await expect(
        expenseSchema.validate({ ...validData, amount: -10 }),
      ).rejects.toThrow('Amount must be greater than 0')
    })

    it('rejects an amount above 1,000,000', async () => {
      await expect(
        expenseSchema.validate({ ...validData, amount: 1_000_001 }),
      ).rejects.toThrow('Amount must be at most 1,000,000')
    })

    it('accepts the maximum amount', async () => {
      const result = await expenseSchema.validate({ ...validData, amount: 1_000_000 })
      expect(result.amount).toBe(1_000_000)
    })
  })

  describe('category', () => {
    it('rejects a missing category', async () => {
      const { category: _, ...without } = validData
      await expect(expenseSchema.validate(without)).rejects.toThrow('Category is required')
    })

    it('rejects an unknown category', async () => {
      await expect(
        expenseSchema.validate({ ...validData, category: 'NOT_A_CATEGORY' }),
      ).rejects.toThrow('Invalid category')
    })

    it('accepts every configured category', async () => {
      for (const category of EXPENSE_CATEGORIES) {
        await expect(expenseSchema.validate({ ...validData, category })).resolves.toMatchObject({ category })
      }
    })
  })

  describe('departmentId', () => {
    it('defaults to null', async () => {
      const result = await expenseSchema.validate(validData)
      expect(result.departmentId).toBeNull()
    })

    it('accepts a department id', async () => {
      const result = await expenseSchema.validate({ ...validData, departmentId: 3 })
      expect(result.departmentId).toBe(3)
    })
  })
})
