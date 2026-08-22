import { object, string } from 'yup'
import type { InferType } from 'yup'

export const tenantSchema = object({
  name: string()
    .trim()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  domain: string()
    .trim()
    .required('Domain is required')
    .max(255, 'Domain must be at most 255 characters')
    .matches(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/,
      'Please enter a valid domain (e.g., company.com)',
    ),
})

export type TenantFormData = InferType<typeof tenantSchema>
