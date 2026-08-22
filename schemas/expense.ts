import { object, string, number } from 'yup'
import { EXPENSE_CATEGORIES } from '~/types/expense'

export const expenseSchema = object({
  title: string()
    .trim()
    .required('Title is required')
    .max(255, 'Title must be at most 255 characters'),
  description: string()
    .trim()
    .max(2000, 'Description must be at most 2000 characters')
    .default(''),
  amount: number()
    .typeError('Amount is required')
    .required('Amount is required')
    .positive('Amount must be greater than 0')
    .max(1_000_000, 'Amount must be at most 1,000,000'),
  currency: string()
    .required('Currency is required')
    .oneOf(['USD', 'EUR', 'GBP'], 'Invalid currency'),
  category: string()
    .required('Category is required')
    .oneOf(EXPENSE_CATEGORIES as unknown as string[], 'Invalid category'),
  departmentId: string()
    .required('Department is required'),
})

export type ExpenseFormData = {
  title: string
  description: string
  amount: number | null
  currency: string
  category: string
  departmentId: string
}
