import { describe, expect, it } from 'vitest'
import { createUserSchema, updateUserSchema } from '~/schemas/user'

describe('createUserSchema', () => {
  const validData = {
    email: 'john@example.com',
    password: 'Password123!',
    departmentId: 1,
  }

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
      expect(result.password).toBe('Password123!')
    })

    it('rejects empty password', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: '' }),
      ).rejects.toThrow('Password is required')
    })

    it('rejects password shorter than 8 characters', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: 'Pass1!' }),
      ).rejects.toThrow('Password must be at least 8 characters')
    })

    it('rejects password without uppercase letter', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: 'password123!' }),
      ).rejects.toThrow('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    })

    it('rejects password without lowercase letter', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: 'PASSWORD123!' }),
      ).rejects.toThrow('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    })

    it('rejects password without number', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: 'PasswordABC!' }),
      ).rejects.toThrow('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    })

    it('rejects password without special character', async () => {
      await expect(
        createUserSchema.validate({ ...validData, password: 'Password123' }),
      ).rejects.toThrow('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
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

    it('is not required when roleName is PLATFORM_ADMIN', async () => {
      const result = await createUserSchema.validate({
        ...validData,
        roleName: 'PLATFORM_ADMIN',
        departmentId: undefined,
      })
      expect(result.departmentId).toBeNull()
      expect(result.roleName).toBe('PLATFORM_ADMIN')
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
