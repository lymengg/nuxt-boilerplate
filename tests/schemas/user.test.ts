import { describe, expect, it } from 'vitest'
import { createUserSchema, updateUserSchema } from '~/schemas/user'

describe('createUserSchema', () => {
  const validData = {
    username: 'john.doe',
    email: 'john@example.com',
    password: 'Password123',
    departmentId: 1,
  }

  describe('username', () => {
    it('accepts valid username', async () => {
      const result = await createUserSchema.validate(validData)
      expect(result.username).toBe('john.doe')
    })

    it('rejects empty username', async () => {
      await expect(
        createUserSchema.validate({ ...validData, username: '' }),
      ).rejects.toThrow('Username is required')
    })

    it('rejects username shorter than 3 characters', async () => {
      await expect(
        createUserSchema.validate({ ...validData, username: 'ab' }),
      ).rejects.toThrow('Username must be at least 3 characters')
    })

    it('rejects username longer than 50 characters', async () => {
      await expect(
        createUserSchema.validate({ ...validData, username: 'a'.repeat(51) }),
      ).rejects.toThrow('Username must be at most 50 characters')
    })

    it('rejects username with special characters', async () => {
      await expect(
        createUserSchema.validate({ ...validData, username: 'john@doe' }),
      ).rejects.toThrow('Username may only contain letters, numbers, dots, dashes and underscores')
    })

    it('accepts username with dots, dashes, and underscores', async () => {
      const result = await createUserSchema.validate({
        ...validData,
        username: 'john_doe-1.0',
      })
      expect(result.username).toBe('john_doe-1.0')
    })

    it('trims whitespace from username', async () => {
      const result = await createUserSchema.validate({
        ...validData,
        username: '  john.doe  ',
      })
      expect(result.username).toBe('john.doe')
    })
  })

  describe('email', () => {
    it('accepts valid email', async () => {
      const result = await createUserSchema.validate(validData)
      expect(result.email).toBe('john@example.com')
    })

    it('rejects empty email', async () => {
      await expect(
        createUserSchema.validate({ ...validData, email: '' }),
      ).rejects.toThrow('Email is required')
    })

    it('rejects invalid email format', async () => {
      await expect(
        createUserSchema.validate({ ...validData, email: 'not-an-email' }),
      ).rejects.toThrow('Please enter a valid email address')
    })

    it('rejects email longer than 100 characters', async () => {
      await expect(
        createUserSchema.validate({ ...validData, email: `${'a'.repeat(90)}@example.com` }),
      ).rejects.toThrow('Email must be at most 100 characters')
    })

    it('trims whitespace from email', async () => {
      const result = await createUserSchema.validate({
        ...validData,
        email: '  john@example.com  ',
      })
      expect(result.email).toBe('john@example.com')
    })
  })

  describe('password', () => {
    it('accepts valid password', async () => {
      const result = await createUserSchema.validate(validData)
      expect(result.password).toBe('Password123')
    })

    it('rejects empty password', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: '' }),
      ).rejects.toThrow('Password is required')
    })

    it('rejects password shorter than 8 characters', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: 'Pass1' }),
      ).rejects.toThrow('Password must be at least 8 characters')
    })

    it('rejects password without uppercase letter', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: 'password123' }),
      ).rejects.toThrow('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    })

    it('rejects password without lowercase letter', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: 'PASSWORD123' }),
      ).rejects.toThrow('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    })

    it('rejects password without number', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: 'PasswordABC' }),
      ).rejects.toThrow('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    })
  })

  describe('firstName and lastName', () => {
    it('accepts empty firstName and lastName', async () => {
      const result = await createUserSchema.validate(validData)
      expect(result.firstName).toBe('')
      expect(result.lastName).toBe('')
    })

    it('accepts valid firstName', async () => {
      const result = await createUserSchema.validate({
        ...validData,
        firstName: 'John',
      })
      expect(result.firstName).toBe('John')
    })

    it('rejects firstName longer than 50 characters', async () => {
      await expect(
        createUserSchema.validate({ ...validData, firstName: 'J'.repeat(51) }),
      ).rejects.toThrow('First name must be at most 50 characters')
    })

    it('rejects lastName longer than 50 characters', async () => {
      await expect(
        createUserSchema.validate({ ...validData, lastName: 'D'.repeat(51) }),
      ).rejects.toThrow('Last name must be at most 50 characters')
    })
  })

  describe('departmentId', () => {
    it('accepts valid departmentId', async () => {
      const result = await createUserSchema.validate(validData)
      expect(result.departmentId).toBe(1)
    })

    it('rejects missing departmentId', async () => {
      const { departmentId: _, ...dataWithoutDept } = validData
      await expect(
        createUserSchema.validate(dataWithoutDept),
      ).rejects.toThrow('Department is required')
    })
  })

  describe('tenantId', () => {
    it('defaults tenantId to null', async () => {
      const result = await createUserSchema.validate(validData)
      expect(result.tenantId).toBeNull()
    })

    it('accepts valid tenantId', async () => {
      const result = await createUserSchema.validate({
        ...validData,
        tenantId: 5,
      })
      expect(result.tenantId).toBe(5)
    })
  })

  describe('roleName', () => {
    it('defaults roleName to empty string', async () => {
      const result = await createUserSchema.validate(validData)
      expect(result.roleName).toBe('')
    })

    it('accepts valid roleName', async () => {
      const result = await createUserSchema.validate({
        ...validData,
        roleName: 'ADMIN',
      })
      expect(result.roleName).toBe('ADMIN')
    })
  })
})

describe('updateUserSchema', () => {
  describe('firstName', () => {
    it('accepts valid firstName', async () => {
      const result = await updateUserSchema.validate({ firstName: 'Jane' })
      expect(result.firstName).toBe('Jane')
    })

    it('defaults to empty string', async () => {
      const result = await updateUserSchema.validate({})
      expect(result.firstName).toBe('')
    })

    it('rejects firstName longer than 50 characters', async () => {
      await expect(
        updateUserSchema.validate({ firstName: 'J'.repeat(51) }),
      ).rejects.toThrow('First name must be at most 50 characters')
    })
  })

  describe('lastName', () => {
    it('accepts valid lastName', async () => {
      const result = await updateUserSchema.validate({ lastName: 'Doe' })
      expect(result.lastName).toBe('Doe')
    })

    it('defaults to empty string', async () => {
      const result = await updateUserSchema.validate({})
      expect(result.lastName).toBe('')
    })

    it('rejects lastName longer than 50 characters', async () => {
      await expect(
        updateUserSchema.validate({ lastName: 'D'.repeat(51) }),
      ).rejects.toThrow('Last name must be at most 50 characters')
    })
  })

  describe('departmentId', () => {
    it('accepts valid departmentId', async () => {
      const result = await updateUserSchema.validate({ departmentId: 2 })
      expect(result.departmentId).toBe(2)
    })

    it('defaults to null', async () => {
      const result = await updateUserSchema.validate({})
      expect(result.departmentId).toBeNull()
    })

    it('accepts null departmentId', async () => {
      const result = await updateUserSchema.validate({ departmentId: null })
      expect(result.departmentId).toBeNull()
    })
  })
})
