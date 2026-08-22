import type { ObjectSchema } from 'yup'
import { ValidationError } from 'yup'

type SchemaLike = ObjectSchema<Record<string, any>>

export function useFormValidation(schema: SchemaLike) {
  const errors = ref<Record<string, string>>({})

  function clearErrors() {
    errors.value = {}
  }

  async function validate(data: Record<string, unknown>, overrideSchema?: SchemaLike): Promise<boolean> {
    clearErrors()
    const activeSchema = overrideSchema ?? schema
    try {
      await activeSchema.validate(data, { abortEarly: false })
      return true
    }
    catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors: Record<string, string> = {}
        for (const inner of err.inner) {
          if (inner.path && !fieldErrors[inner.path]) {
            fieldErrors[inner.path] = inner.message
          }
        }
        errors.value = fieldErrors
      }
      return false
    }
  }

  function setFieldError(field: string, message: string) {
    errors.value = { ...errors.value, [field]: message }
  }

  function setGeneralError(message: string) {
    errors.value = { ...errors.value, general: message }
  }

  function clearGeneralError() {
    const { general, ...rest } = errors.value
    errors.value = rest
  }

  return {
    errors,
    validate,
    clearErrors,
    setFieldError,
    setGeneralError,
    clearGeneralError,
  }
}
