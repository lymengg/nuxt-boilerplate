import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import type { ObjectSchema } from 'yup'

type SchemaLike = ObjectSchema<Record<string, any>>

export function useFormValidation(schema: SchemaLike) {
  const { handleSubmit, ...form } = useForm({
    validationSchema: toTypedSchema(schema),
  })

  function setFieldError(field: string, message: string) {
    form.setFieldError(field, message)
  }

  function setGeneralError(message: string) {
    form.setFieldError('__general', message)
  }

  function clearGeneralError() {
    form.setFieldError('__general', undefined)
  }

  return {
    ...form,
    handleSubmit,
    setFieldError,
    setGeneralError,
    clearGeneralError,
  }
}
