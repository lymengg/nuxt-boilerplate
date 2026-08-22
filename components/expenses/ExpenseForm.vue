<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Expense' : 'Create Expense'"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>
      <Field as="div" name="title" v-slot="{ field, errorMessage }">
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

      <Field as="div" name="description" v-slot="{ field, errorMessage }">
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
        <Field as="div" name="amount" v-slot="{ field, errorMessage }">
          <label for="amount" class="block text-sm font-medium text-slate-700 mb-1">Amount</label>
          <InputNumber
            id="amount"
            :modelValue="field.value"
            @update:modelValue="field.onChange"
            mode="currency"
            currency="USD"
            locale="en-US"
            class="w-full"
            :invalid="!!errorMessage"
            required
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>

        <Field as="div" name="currency" v-slot="{ field, errorMessage }">
          <label for="currency" class="block text-sm font-medium text-slate-700 mb-1">Currency</label>
          <Select
            id="currency"
            :modelValue="field.value"
            @update:modelValue="field.onChange"
            @blur="field.onBlur"
            :options="currencies"
            class="w-full"
            :invalid="!!errorMessage"
            required
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </div>

      <Field as="div" name="category" v-slot="{ field, errorMessage }">
        <label for="category" class="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <Select
          id="category"
          :modelValue="field.value"
          @update:modelValue="field.onChange"
          @blur="field.onBlur"
          :options="categories"
          class="w-full"
          :invalid="!!errorMessage"
          required
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field as="div" name="departmentId" v-slot="{ field, errorMessage }">
        <label for="department" class="block text-sm font-medium text-slate-700 mb-1">Department</label>
        <Select
          id="department"
          :modelValue="field.value"
          @update:modelValue="field.onChange"
          @blur="field.onBlur"
          :options="departments"
          optionLabel="name"
          optionValue="id"
          placeholder="Select department"
          class="w-full"
          :invalid="!!errorMessage"
          required
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <div v-if="!isEditing">
        <label for="receipt" class="block text-sm font-medium text-slate-700 mb-1">Receipt (optional)</label>
        <FileUpload
          mode="basic"
          name="receipt"
          accept="image/*,application/pdf"
          :maxFileSize="5000000"
          chooseLabel="Choose File"
          class="w-full"
          @select="onFileSelect"
        />
      </div>
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
import { expenseSchema, type ExpenseFormData } from '~/schemas/expense'
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
const currencies = ['USD', 'EUR', 'GBP']

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
          currency: props.expense.currency,
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
          amount: null,
          currency: 'USD',
          category: '',
          departmentId: '',
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
        currency: values.currency,
        category: values.category,
        departmentId: values.departmentId,
      }
      await updateExpense(props.expense.id, data)
    }
    else {
      const data: CreateExpenseRequest = {
        title: values.title,
        description: values.description,
        amount: values.amount!,
        currency: values.currency,
        category: values.category,
        departmentId: values.departmentId,
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

function onFileSelect(event: { files: File[] }) {
  if (event.files.length > 0) {
    // Handle file selection if needed
  }
}
</script>
