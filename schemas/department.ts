import { object, string, number, array } from 'yup'
import type { InferType } from 'yup'

export const departmentSchema = object({
  name: string()
    .trim()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  tenantId: number()
    .typeError('Tenant is required')
    .required('Tenant is required'),
  managerIds: array()
    .of(number().required())
    .default([]),
})

export type DepartmentFormData = InferType<typeof departmentSchema>
