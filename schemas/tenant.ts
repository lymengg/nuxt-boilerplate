import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { TenantStatus } from '~/types/tenant'

const TENANT_STATUSES: TenantStatus[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED']

export const tenantSchema = object({
  name: string()
    .trim()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  status: string<TenantStatus>()
    .required('Status is required')
    .oneOf(TENANT_STATUSES, 'Invalid status'),
})

export type TenantFormData = InferType<typeof tenantSchema>
