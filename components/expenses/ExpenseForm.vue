<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="form-field">
      <label for="title" class="form-label">Title</label>
      <InputText
        id="title"
        v-model="form.title"
        class="w-full"
        :invalid="!!errors.title"
        placeholder="Enter expense title"
      />
      <small v-if="errors.title" class="form-error">{{ errors.title }}</small>
    </div>

    <div class="form-field">
      <label for="description" class="form-label">Description</label>
      <Textarea
        id="description"
        v-model="form.description"
        rows="3"
        class="w-full"
        :invalid="!!errors.description"
        placeholder="Describe the expense..."
      />
      <small v-if="errors.description" class="form-error">{{ errors.description }}</small>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="form-field">
        <label for="amount" class="form-label">Amount</label>
        <InputNumber
          id="amount"
          v-model="form.amount"
          mode="currency"
          currency="USD"
          locale="en-US"
          class="w-full"
          :invalid="!!errors.amount"
        />
        <small v-if="errors.amount" class="form-error">{{ errors.amount }}</small>
      </div>

      <div class="form-field">
        <label for="category" class="form-label">Category</label>
        <Select
          id="category"
          v-model="form.category"
          :options="categories"
          optionLabel="label"
          optionValue="value"
          placeholder="Select category"
          class="w-full"
          :invalid="!!errors.category"
        />
        <small v-if="errors.category" class="form-error">{{ errors.category }}</small>
      </div>
    </div>

    <div class="form-field">
      <label for="department" class="form-label">Department</label>
      <Select
        id="department"
        v-model="form.departmentId"
        :options="departments"
        optionLabel="name"
        optionValue="id"
        placeholder="Select department"
        class="w-full"
        :invalid="!!errors.departmentId"
      />
      <small v-if="errors.departmentId" class="form-error">{{ errors.departmentId }}</small>
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" label="Cancel" severity="secondary" text @click="$emit('cancel')" />
      <Button type="submit" label="Submit" :loading="isSubmitting" />
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { EXPENSE_CATEGORIES } from '~/types'

const emit = defineEmits<{
  submit: [data: { title: string; description: string; amount: number; currency: string; category: string; departmentId: string }]
  cancel: []
}>()

const { departments, fetchAllDepartments } = useDepartments()

const isSubmitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  amount: 0,
  currency: 'USD',
  category: '',
  departmentId: '',
})

const errors = reactive({
  title: '',
  description: '',
  amount: '',
  category: '',
  departmentId: '',
})

const categories = EXPENSE_CATEGORIES.map((c) => ({ label: c, value: c }))

function validate() {
  let valid = true
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    valid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required'
    valid = false
  }

  if (!form.amount || form.amount <= 0) {
    errors.amount = 'Amount must be greater than 0'
    valid = false
  }

  if (!form.category) {
    errors.category = 'Category is required'
    valid = false
  }

  if (!form.departmentId) {
    errors.departmentId = 'Department is required'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  isSubmitting.value = true
  try {
    emit('submit', { ...form })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchAllDepartments()
})
</script>
