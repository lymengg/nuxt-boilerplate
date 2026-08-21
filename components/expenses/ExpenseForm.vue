<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Expense' : 'Create Expense'"
    :modal="true"
    :closable="!loading"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label for="title" class="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <InputText
          id="title"
          v-model="form.title"
          class="w-full"
          :class="{ 'p-invalid': errors.title }"
          required
        />
        <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <Textarea
          id="description"
          v-model="form.description"
          class="w-full"
          rows="3"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="amount" class="block text-sm font-medium text-slate-700 mb-1">Amount</label>
          <InputNumber
            id="amount"
            v-model="form.amount"
            mode="currency"
            currency="USD"
            locale="en-US"
            class="w-full"
            :class="{ 'p-invalid': errors.amount }"
            required
          />
          <small v-if="errors.amount" class="text-red-500">{{ errors.amount }}</small>
        </div>

        <div>
          <label for="currency" class="block text-sm font-medium text-slate-700 mb-1">Currency</label>
          <Select
            id="currency"
            v-model="form.currency"
            :options="currencies"
            class="w-full"
            required
          />
        </div>
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <Select
          id="category"
          v-model="form.category"
          :options="categories"
          class="w-full"
          :class="{ 'p-invalid': errors.category }"
          required
        />
        <small v-if="errors.category" class="text-red-500">{{ errors.category }}</small>
      </div>

      <div>
        <label for="department" class="block text-sm font-medium text-slate-700 mb-1">Department</label>
        <Select
          id="department"
          v-model="form.departmentId"
          :options="departments"
          optionLabel="name"
          optionValue="id"
          placeholder="Select department"
          class="w-full"
          :class="{ 'p-invalid': errors.departmentId }"
          required
        />
        <small v-if="errors.departmentId" class="text-red-500">{{ errors.departmentId }}</small>
      </div>

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
        :disabled="loading"
        @click="visible = false"
      />
      <Button
        :label="isEditing ? 'Update' : 'Create'"
        :loading="loading"
        @click="handleSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { CreateExpenseRequest, Expense, UpdateExpenseRequest } from '~/types/expense'
import { EXPENSE_CATEGORIES } from '~/types/expense'

const props = defineProps<{
  expense?: Expense
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { createExpense, updateExpense } = useExpenses()
const { allDepartments, fetchAllDepartments } = useDepartments()

const loading = ref(false)
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.expense)

const categories = [...EXPENSE_CATEGORIES]
const currencies = ['USD', 'EUR', 'GBP']

const form = reactive({
  title: '',
  description: '',
  amount: null as number | null,
  currency: 'USD',
  category: '',
  departmentId: '',
})

const departments = computed(() => allDepartments.value)

watch(visible, (val) => {
  if (val) {
    fetchAllDepartments()
    if (props.expense) {
      form.title = props.expense.title
      form.description = props.expense.description
      form.amount = props.expense.amount
      form.currency = props.expense.currency
      form.category = props.expense.category
      form.departmentId = props.expense.departmentId
    }
    else {
      form.title = ''
      form.description = ''
      form.amount = null
      form.currency = 'USD'
      form.category = ''
      form.departmentId = ''
    }
    errors.value = {}
  }
})

function validate(): boolean {
  errors.value = {}

  if (!form.title.trim()) {
    errors.value.title = 'Title is required'
  }
  if (!form.amount || form.amount <= 0) {
    errors.value.amount = 'Amount must be greater than 0'
  }
  if (!form.category) {
    errors.value.category = 'Category is required'
  }
  if (!form.departmentId) {
    errors.value.departmentId = 'Department is required'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  try {
    if (isEditing.value && props.expense) {
      const data: UpdateExpenseRequest = {
        title: form.title,
        description: form.description,
        amount: form.amount!,
        currency: form.currency,
        category: form.category,
        departmentId: form.departmentId,
      }
      await updateExpense(props.expense.id, data)
    }
    else {
      const data: CreateExpenseRequest = {
        title: form.title,
        description: form.description,
        amount: form.amount!,
        currency: form.currency,
        category: form.category,
        departmentId: form.departmentId,
      }
      await createExpense(data)
    }
    visible.value = false
    emit('saved')
  }
  catch (e) {
    const msg = getErrorMessage(e)
    errors.value = { general: msg }
  }
  finally {
    loading.value = false
  }
}

function onFileSelect(event: { files: File[] }) {
  if (event.files.length > 0) {
    // Handle file selection if needed
  }
}
</script>
