import { object, string } from 'yup'

export const departmentSchema = object({
  name: string()
    .trim()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  description: string()
    .trim()
    .max(500, 'Description must be at most 500 characters')
    .default(''),
  tenantId: string()
    .required('Tenant is required'),
})

export type DepartmentFormData = {
  name: string
  description: string
  tenantId: string
}
