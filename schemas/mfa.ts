import { object, string } from 'yup'
import type { InferType } from 'yup'

export const mfaVerifySchema = object({
  token: string()
    .trim()
    .required('Please enter the verification code')
    .length(6, 'Verification code must be exactly 6 digits')
    .matches(/^\d+$/, 'Verification code must contain only digits'),
})

export type MfaVerifyFormData = InferType<typeof mfaVerifySchema>
