import { object, string, ref } from 'yup'
import type { InferType } from 'yup'

/** Shared password policy — mirrors the backend `@Password` validator. */
const newPassword = string()
  .required('New password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  )

export const changePasswordSchema = object({
  currentPassword: string()
    .required('Current password is required'),
  newPassword,
  confirmPassword: string()
    .required('Please confirm the new password')
    .oneOf([ref('newPassword')], 'Passwords do not match'),
})

export const resetPasswordSchema = object({
  token: string()
    .required('Reset token is required'),
  newPassword,
  confirmPassword: string()
    .required('Please confirm the new password')
    .oneOf([ref('newPassword')], 'Passwords do not match'),
})

export const forgotPasswordSchema = object({
  email: string()
    .trim()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be at most 100 characters'),
})

export type ChangePasswordFormData = InferType<typeof changePasswordSchema>
export type ResetPasswordFormData = InferType<typeof resetPasswordSchema>
export type ForgotPasswordFormData = InferType<typeof forgotPasswordSchema>
