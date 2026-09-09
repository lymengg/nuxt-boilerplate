import { describe, expect, it } from 'vitest'
import { changePasswordSchema, resetPasswordSchema, forgotPasswordSchema } from '~/schemas/password'

const VALID_PASSWORD = 'Password123!'

/** Validates and returns ALL error messages (yup collects cross-field refs eagerly). */
async function errorsOf(
  schema: { validate: (data: unknown, options?: { abortEarly?: boolean }) => Promise<unknown> },
  data: Record<string, unknown>,
): Promise<string[]> {
  try {
    await schema.validate(data, { abortEarly: false })
    return []
  }
  catch (error) {
    return (error as { errors: string[] }).errors
  }
}

describe('changePasswordSchema', () => {
  const validData = {
    currentPassword: 'OldPassword1!',
    newPassword: VALID_PASSWORD,
    confirmPassword: VALID_PASSWORD,
  }

  it('accepts a valid payload', async () => {
    const result = await changePasswordSchema.validate(validData)
    expect(result.newPassword).toBe(VALID_PASSWORD)
  })

  it('rejects a missing current password', async () => {
    const { currentPassword: _, ...without } = validData
    await expect(changePasswordSchema.validate(without)).rejects.toThrow('Current password is required')
  })

  it('rejects a missing new password', async () => {
    const errors = await errorsOf(changePasswordSchema, { ...validData, newPassword: '' })
    expect(errors).toContain('New password is required')
  })

  it('rejects a new password shorter than 8 characters', async () => {
    const errors = await errorsOf(changePasswordSchema, { ...validData, newPassword: 'Pass1!', confirmPassword: 'Pass1!' })
    expect(errors).toContain('Password must be at least 8 characters')
  })

  it('rejects a new password without uppercase, lowercase, digit and special character', async () => {
    const errors = await errorsOf(changePasswordSchema, { ...validData, newPassword: 'password', confirmPassword: 'password' })
    expect(errors).toContain('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  })

  it('rejects a new password without a special character', async () => {
    const errors = await errorsOf(changePasswordSchema, { ...validData, newPassword: 'Password123', confirmPassword: 'Password123' })
    expect(errors).toContain('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  })

  it('rejects a missing confirmation', async () => {
    const errors = await errorsOf(changePasswordSchema, { ...validData, confirmPassword: '' })
    // Note: for an empty value yup's oneOf([ref('newPassword')]) fires before
    // required(), so the mismatch message shadows "Please confirm...". The
    // field is rejected either way — assert the actual emitted message.
    expect(errors).toContain('Passwords do not match')
  })

  it('rejects mismatched confirmation', async () => {
    const errors = await errorsOf(changePasswordSchema, { ...validData, confirmPassword: 'Different123!' })
    expect(errors).toContain('Passwords do not match')
  })
})

describe('resetPasswordSchema', () => {
  const validData = {
    token: 'reset-token-abc',
    newPassword: VALID_PASSWORD,
    confirmPassword: VALID_PASSWORD,
  }

  it('accepts a valid payload', async () => {
    const result = await resetPasswordSchema.validate(validData)
    expect(result.token).toBe('reset-token-abc')
  })

  it('rejects a missing token', async () => {
    await expect(
      resetPasswordSchema.validate({ ...validData, token: '' }),
    ).rejects.toThrow('Reset token is required')
  })

  it('rejects a weak new password', async () => {
    const errors = await errorsOf(resetPasswordSchema, { ...validData, newPassword: 'weak', confirmPassword: 'weak' })
    expect(errors).toContain('Password must be at least 8 characters')
  })

  it('rejects a new password without a special character', async () => {
    const errors = await errorsOf(resetPasswordSchema, { ...validData, newPassword: 'Password123', confirmPassword: 'Password123' })
    expect(errors).toContain('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  })

  it('rejects mismatched confirmation', async () => {
    const errors = await errorsOf(resetPasswordSchema, { ...validData, confirmPassword: 'Different123!' })
    expect(errors).toContain('Passwords do not match')
  })
})

describe('forgotPasswordSchema', () => {
  it('accepts a valid email', async () => {
    const result = await forgotPasswordSchema.validate({ email: 'john@example.com' })
    expect(result.email).toBe('john@example.com')
  })

  it('rejects an empty email', async () => {
    await expect(forgotPasswordSchema.validate({ email: '' })).rejects.toThrow('Email is required')
  })

  it('rejects an invalid email format', async () => {
    await expect(forgotPasswordSchema.validate({ email: 'not-an-email' })).rejects.toThrow('Please enter a valid email address')
  })

  it('rejects an email longer than 100 characters', async () => {
    await expect(
      forgotPasswordSchema.validate({ email: `${'a'.repeat(90)}@example.com` }),
    ).rejects.toThrow('Email must be at most 100 characters')
  })

  it('trims surrounding whitespace', async () => {
    const result = await forgotPasswordSchema.validate({ email: '  john@example.com  ' })
    expect(result.email).toBe('john@example.com')
  })
})
