import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import type { ObjectSchema } from 'yup'

type SchemaLike = ObjectSchema<Record<string, any>>

export function useFormValidation(schema: SchemaLike) {
  const { handleSubmit, ...form } = useForm({
    validationSchema: toTypedSchema(schema),
  })

  return {
    ...form,
    handleSubmit,
  }
}
