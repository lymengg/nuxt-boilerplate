import { object, string, number } from 'yup'
import type { InferType } from 'yup'
import { passwordSchema } from './password'

export const createUserSchema = object({
  email: string()
    .trim()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be at most 100 characters'),
  password: passwordSchema,
  firstName: string()
    .trim()
    .max(50, 'First name must be at most 50 characters')
    .default(''),
  lastName: string()
    .trim()
    .max(50, 'Last name must be at most 50 characters')
    .default(''),
  tenantId: number()
    .nullable()
    .default(null),
  departmentId: number()
    .nullable()
    .default(null)
    .when('roleName', {
      is: (roleName: string | null | undefined) => !roleName || roleName !== 'PLATFORM_ADMIN',
      then: schema => schema.required('Department is required'),
      otherwise: schema => schema.nullable().default(null),
    }),
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
