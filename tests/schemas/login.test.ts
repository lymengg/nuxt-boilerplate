import { describe, expect, it } from 'vitest'
import { loginSchema } from '~/schemas/login'

describe('loginSchema', () => {
  const validData = {
    usernameOrEmail: 'john.doe',
    password: 'Password123!',
  }

  describe('usernameOrEmail', () => {
    it('accepts a valid username or email', async () => {
      const result = await loginSchema.validate(validData)
      expect(result.usernameOrEmail).toBe('john.doe')
    })

    it('accepts an email address', async () => {
      const result = await loginSchema.validate({
        usernameOrEmail: 'john@example.com',
        password: 'Password123!',
      })
      expect(result.usernameOrEmail).toBe('john@example.com')
    })

    it('rejects a blank username', async () => {
      await expect(
        loginSchema.validate({ ...validData, usernameOrEmail: '' }),
      ).rejects.toThrow('Username or email is required')
    })

    it('rejects whitespace-only username', async () => {
      await expect(
        loginSchema.validate({ ...validData, usernameOrEmail: '   ' }),
      ).rejects.toThrow('Username or email is required')
    })

    it('rejects a username longer than 100 characters', async () => {
      await expect(
        loginSchema.validate({ ...validData, usernameOrEmail: 'a'.repeat(101) }),
      ).rejects.toThrow('Username or email must be at most 100 characters')
    })

    it('trims surrounding whitespace', async () => {
      const result = await loginSchema.validate({
        ...validData,
        usernameOrEmail: '  john.doe  ',
      })
      expect(result.usernameOrEmail).toBe('john.doe')
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
