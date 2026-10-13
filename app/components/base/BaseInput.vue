<script setup lang="ts">
import { useId } from 'vue'

const model = defineModel<string>({ required: true })

const props = defineProps<{
  label: string
  type?: 'text' | 'email'
  inputmode?: 'text' | 'numeric' | 'decimal'
  unit?: string
  hint?: string
  error?: string | null
  autocomplete?: string
}>()

const id = useId()
const describedBy = [props.hint ? `${id}-hint` : '', `${id}-error`].filter(Boolean).join(' ')
</script>

<template>
  <div class="grid gap-2 text-left">
    <label :for="id" class="text-sm font-semibold">{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :type="type ?? 'text'"
        :inputmode="inputmode"
        :autocomplete="autocomplete ?? 'off'"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        class="h-14 w-full rounded-field border bg-surface px-4 text-lg"
        :class="[error ? 'border-danger' : 'border-line', unit ? 'pr-14' : '']"
      />
      <span
        v-if="unit"
        class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
        aria-hidden="true"
        >{{ unit }}</span
      >
    </div>
    <p v-if="hint" :id="`${id}-hint`" class="text-sm text-muted">{{ hint }}</p>
    <p :id="`${id}-error`" class="min-h-5 text-sm text-danger" aria-live="polite">
      {{ error ?? '' }}
    </p>
  </div>
</template>
