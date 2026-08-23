import { object, string } from 'yup'
import type { InferType } from 'yup'

export const loginSchema = object({
  usernameOrEmail: string()
    .trim()
    .required('Username or email is required')
    .max(100, 'Username or email must be at most 100 characters'),
  password: string()
    .required('Password is required'),
})

export type LoginFormData = InferType<typeof loginSchema>
