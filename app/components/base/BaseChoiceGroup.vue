<script setup lang="ts">
import { useId } from 'vue'

/** Accessible radio group rendered as selectable cards. */
const model = defineModel<string | null>({ required: true })

defineProps<{
  legend: string
  options: { value: string; label: string; description?: string }[]
}>()

const name = useId()
</script>

<template>
  <fieldset class="grid gap-3 text-left">
    <legend class="mb-2 text-sm font-semibold">{{ legend }}</legend>
    <label
      v-for="option in options"
      :key="option.value"
      class="flex cursor-pointer items-start gap-4 rounded-card border bg-surface p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
      :class="model === option.value ? 'border-brand bg-brand-soft' : 'border-line hover:border-ink'"
    >
      <input
        v-model="model"
        type="radio"
        :name="name"
        :value="option.value"
        class="mt-1 h-5 w-5 accent-brand focus-visible:outline-none"
      />
      <span>
        <span class="block font-semibold">{{ option.label }}</span>
        <span v-if="option.description" class="block text-muted">{{ option.description }}</span>
      </span>
    </label>
  </fieldset>
</template>
