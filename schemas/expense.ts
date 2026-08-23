import { object, string, number } from 'yup'
import type { InferType } from 'yup'
import { EXPENSE_CATEGORIES } from '~/types/expense'

export const expenseSchema = object({
  title: string()
    .trim()
    .required('Title is required')
    .max(200, 'Title must be at most 200 characters'),
  description: string()
    .trim()
    .max(1000, 'Description must be at most 1000 characters')
    .default(''),
  amount: number()
    .typeError('Amount is required')
    .required('Amount is required')
    .positive('Amount must be greater than 0')
    .max(1_000_000, 'Amount must be at most 1,000,000'),
  category: string()
    .required('Category is required')
    .oneOf(EXPENSE_CATEGORIES as unknown as string[], 'Invalid category'),
  departmentId: number()
    .nullable()
    .default(null),
})

export type ExpenseFormData = InferType<typeof expenseSchema>
