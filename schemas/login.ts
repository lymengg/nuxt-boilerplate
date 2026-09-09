import { object, string } from 'yup'
import type { InferType } from 'yup'

export const loginSchema = object({
  email: string()
    .trim()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be at most 100 characters'),
  password: string()
    .required('Password is required'),
})

export type LoginFormData = InferType<typeof loginSchema>
