<script setup lang="ts">
import { useId } from 'vue'

const model = defineModel<string>({ required: true })

defineProps<{
  label: string
  options: { value: string; label: string }[]
  placeholder?: string
  disabled?: boolean
  error?: string | null
}>()

const id = useId()
</script>

<template>
  <div class="grid gap-2 text-left">
    <label :for="id" class="text-sm font-semibold">{{ label }}</label>
    <select
      :id="id"
      v-model="model"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="`${id}-error`"
      class="h-14 w-full rounded-field border bg-surface px-4 text-lg disabled:opacity-60"
      :class="error ? 'border-danger' : 'border-line'"
    >
      <option value="" disabled>{{ placeholder ?? 'Choose an option' }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p :id="`${id}-error`" class="min-h-5 text-sm text-danger" aria-live="polite">
      {{ error ?? '' }}
    </p>
  </div>
</template>
