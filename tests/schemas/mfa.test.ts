import { describe, expect, it } from 'vitest'
import { mfaVerifySchema } from '~/schemas/mfa'

describe('mfaVerifySchema', () => {
  it('accepts a valid 6-digit code', async () => {
    const result = await mfaVerifySchema.validate({ code: '123456' })
    expect(result.code).toBe('123456')
  })

  it('rejects a blank code', async () => {
    await expect(
      mfaVerifySchema.validate({ code: '' }),
    ).rejects.toThrow('Please enter the verification code')
  })

  it('rejects a missing code', async () => {
    await expect(mfaVerifySchema.validate({})).rejects.toThrow('Please enter the verification code')
  })

  it('rejects a code shorter than 6 digits', async () => {
    await expect(
      mfaVerifySchema.validate({ code: '12345' }),
    ).rejects.toThrow('Verification code must be exactly 6 digits')
  })

  it('rejects a code longer than 6 digits', async () => {
    await expect(
      mfaVerifySchema.validate({ code: '1234567' }),
    ).rejects.toThrow('Verification code must be exactly 6 digits')
  })

  it('rejects a code containing non-digits', async () => {
    await expect(
      mfaVerifySchema.validate({ code: '12345a' }),
    ).rejects.toThrow('Verification code must contain only digits')
  })

  it('trims surrounding whitespace before validating length', async () => {
    await expect(
      mfaVerifySchema.validate({ code: ' 123456 ' }),
    ).resolves.toMatchObject({ code: '123456' })
  })
})
