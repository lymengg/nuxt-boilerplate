import { object, string, number } from 'yup'
import type { InferType } from 'yup'

export const createUserSchema = object({
  username: string()
    .trim()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .matches(/^[a-zA-Z0-9._-]+$/, 'Username may only contain letters, numbers, dots, dashes and underscores'),
  email: string()
    .trim()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be at most 100 characters'),
  firstName: string()
    .trim()
    .max(50, 'First name must be at most 50 characters')
    .default(''),
  lastName: string()
    .trim()
    .max(50, 'Last name must be at most 50 characters')
    .default(''),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  tenantId: number()
    .nullable()
    .default(null),
  departmentId: number()
    .typeError('Department is required')
    .required('Department is required'),
  roleName: string()
    .trim()
    .default(''),
})

export const updateUserSchema = object({
  firstName: string()
    .trim()
    .max(50, 'First name must be at most 50 characters')
    .default(''),
  lastName: string()
    .trim()
    .max(50, 'Last name must be at most 50 characters')
    .default(''),
  departmentId: number()
    .nullable()
    .default(null),
})

export type CreateUserFormData = InferType<typeof createUserSchema>
export type UpdateUserFormData = InferType<typeof updateUserSchema>
