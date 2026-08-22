import { object, string } from 'yup'

export const roleSchema = object({
  name: string()
    .trim()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  description: string()
    .trim()
    .max(500, 'Description must be at most 500 characters')
    .default(''),
})

export type RoleFormData = {
  name: string
  description: string
}
