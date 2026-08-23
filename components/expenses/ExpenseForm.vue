<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Expense' : 'Create Expense'"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>
      <Field v-slot="{ field, errorMessage }" as="div" name="title">
        <label for="title" class="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <InputText
          id="title"
          v-bind="field"
          class="w-full"
          :invalid="!!errorMessage"
          required
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" as="div" name="description">
        <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <Textarea
          id="description"
          v-bind="field"
          class="w-full"
          rows="3"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <div class="grid grid-cols-2 gap-3">
        <Field v-slot="{ field, errorMessage }" as="div" name="amount">
          <label for="amount" class="block text-sm font-medium text-slate-700 mb-1">Amount</label>
          <InputNumber
            id="amount"
            :model-value="field.value"
            :min="0"
            :min-fraction-digits="2"
            :max-fraction-digits="2"
            class="w-full"
            :invalid="!!errorMessage"
            required
            @update:model-value="field.onChange"
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>

        <Field v-slot="{ field, errorMessage }" as="div" name="category">
          <label for="category" class="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <Select
            id="category"
            :model-value="field.value"
            :options="categories"
            class="w-full"
            :invalid="!!errorMessage"
            required
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </div>

      <Field v-slot="{ field, errorMessage }" as="div" name="departmentId">
        <label for="department" class="block text-sm font-medium text-slate-700 mb-1">
          Department <span class="text-slate-400">(optional)</span>
        </label>
        <Select
          id="department"
          :model-value="field.value"
          :options="departments"
          option-label="name"
          option-value="id"
          placeholder="Your department"
          class="w-full"
          :invalid="!!errorMessage"
          show-clear
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>
    </form>

    <template #footer>
      <Button
        label="Cancel"
        severity="secondary"
        text
        :disabled="isSubmitting"
        @click="visible = false"
      />
      <Button
        :label="isEditing ? 'Update' : 'Create'"
        :loading="isSubmitting"
        @click="onSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { CreateExpenseRequest, Expense, UpdateExpenseRequest } from '~/types/expense'
import { EXPENSE_CATEGORIES } from '~/types/expense'
import { expenseSchema } from '~/schemas/expense'
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

const props = defineProps<{
  expense?: Expense
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(expenseSchema),
})

const { createExpense, updateExpense } = useExpenses()
const { allDepartments, fetchAllDepartments } = useDepartments()

const generalError = ref<string | null>(null)

const isEditing = computed(() => !!props.expense)

const categories = [...EXPENSE_CATEGORIES]
const departments = computed(() => allDepartments.value)

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    fetchAllDepartments()
    if (props.expense) {
      resetForm({
        values: {
          title: props.expense.title,
          description: props.expense.description,
          amount: props.expense.amount,
          category: props.expense.category,
          departmentId: props.expense.departmentId,
        },
      })
    }
    else {
      resetForm({
        values: {
          title: '',
          description: '',
          amount: undefined,
          category: '',
          departmentId: null,
        },
      })
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isEditing.value && props.expense) {
      const data: UpdateExpenseRequest = {
        title: values.title,
        description: values.description,
        amount: values.amount!,
        category: values.category,
      }
      await updateExpense(props.expense.id, data)
    }
    else {
      const data: CreateExpenseRequest = {
        title: values.title,
        description: values.description,
        amount: values.amount!,
        category: values.category,
        departmentId: values.departmentId ?? null,
      }
      await createExpense(data)
    }
    visible.value = false
    emit('saved')
  }
  catch (e) {
    generalError.value = getErrorMessage(e)
  }
})
</script>
