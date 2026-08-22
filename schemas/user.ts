import { object, string, array } from 'yup'
import type { InferType } from 'yup'

export const createUserSchema = object({
  email: string()
    .trim()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be at most 255 characters'),
  firstName: string()
    .trim()
    .required('First name is required')
    .max(100, 'First name must be at most 100 characters'),
  lastName: string()
    .trim()
    .required('Last name is required')
    .max(100, 'Last name must be at most 100 characters'),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  tenantId: string()
    .required('Tenant is required'),
  departmentId: string()
    .default(''),
  roleIds: array()
    .of(string())
    .default([]),
})

export const updateUserSchema = object({
  firstName: string()
    .trim()
    .required('First name is required')
    .max(100, 'First name must be at most 100 characters'),
  lastName: string()
    .trim()
    .required('Last name is required')
    .max(100, 'Last name must be at most 100 characters'),
  departmentId: string()
    .nullable()
    .default(null),
})

export type CreateUserFormData = InferType<typeof createUserSchema>
export type UpdateUserFormData = InferType<typeof updateUserSchema>
