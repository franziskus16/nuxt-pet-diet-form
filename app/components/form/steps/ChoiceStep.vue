<script setup lang="ts" generic="T extends string">
import { ref } from 'vue'
import BaseChoiceGroup from '~/components/base/BaseChoiceGroup.vue'
import StepShell from '~/components/form/StepShell.vue'

/** Reusable step for single-choice questions (diet goal, food behaviour, activity). */
const props = defineProps<{
  title: string
  legend: string
  options: { value: T; label: string; description?: string }[]
  initial: T | null
}>()

const emit = defineEmits<{ answer: [value: T] }>()

const value = ref<string | null>(props.initial)
const error = ref<string | null>(null)

function submit() {
  if (!value.value) {
    error.value = 'Choose one option to continue.'
    return
  }
  emit('answer', value.value as T)
}
</script>

<template>
  <StepShell :title="title" @submit="submit">
    <BaseChoiceGroup v-model="value" :legend="legend" :options="options" @update:model-value="error = null" />
    <p class="min-h-5 text-sm text-danger" aria-live="polite">{{ error ?? '' }}</p>
  </StepShell>
</template>
