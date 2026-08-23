import { object, string } from 'yup'
import type { InferType } from 'yup'

export const roleSchema = object({
  name: string()
    .trim()
    .required('Name is required')
    .max(50, 'Name must be at most 50 characters')
    .matches(/^[A-Za-z0-9_]+$/, 'Name may only contain letters, numbers and underscores'),
  title: string()
    .trim()
    .max(100, 'Title must be at most 100 characters')
    .default(''),
  description: string()
    .trim()
    .max(255, 'Description must be at most 255 characters')
    .default(''),
})

export type RoleFormData = InferType<typeof roleSchema>
