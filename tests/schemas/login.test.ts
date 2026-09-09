import { describe, expect, it } from 'vitest'
import { loginSchema } from '~/schemas/login'

describe('loginSchema', () => {
  const validData = {
    email: 'john@example.com',
    password: 'Password123!',
  }

  describe('email', () => {
    it('accepts a valid email address', async () => {
      const result = await loginSchema.validate(validData)
      expect(result.email).toBe('john@example.com')
    })

    it('rejects a blank email', async () => {
      await expect(
        loginSchema.validate({ ...validData, email: '' }),
      ).rejects.toThrow('Email is required')
    })

    it('rejects whitespace-only email', async () => {
      await expect(
        loginSchema.validate({ ...validData, email: '   ' }),
      ).rejects.toThrow('Email is required')
    })

    it('rejects an invalid email format', async () => {
      await expect(
        loginSchema.validate({ ...validData, email: 'not-an-email' }),
      ).rejects.toThrow('Please enter a valid email address')
    })

    it('rejects an email longer than 100 characters', async () => {
      await expect(
        loginSchema.validate({ ...validData, email: `${'a'.repeat(90)}@example.com` }),
      ).rejects.toThrow('Email must be at most 100 characters')
    })

    it('trims surrounding whitespace', async () => {
      const result = await loginSchema.validate({
        ...validData,
        email: '  john@example.com  ',
      })
      expect(result.email).toBe('john@example.com')
    })
  })

  describe('password', () => {
    it('accepts any non-empty password', async () => {
      const result = await loginSchema.validate(validData)
      expect(result.password).toBe('Password123!')
    })

    it('rejects an empty password', async () => {
      await expect(
        loginSchema.validate({ ...validData, password: '' }),
      ).rejects.toThrow('Password is required')
    })

    it('rejects a missing password', async () => {
      const { password: _, ...withoutPassword } = validData
      await expect(loginSchema.validate(withoutPassword)).rejects.toThrow('Password is required')
    })
  })
})
