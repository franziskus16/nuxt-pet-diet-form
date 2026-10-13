<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '~/components/base/BaseInput.vue'
import StepShell from '~/components/form/StepShell.vue'
import { validatePetAge } from '~/domain/form/validation'
import { useFormStore } from '~/stores/form'

const form = useFormStore()
const age = ref(form.profile.petAge?.toString() ?? '')
const error = ref<string | null>(null)

function submit() {
  const raw = age.value.trim()
  const value = raw === '' ? null : Number(raw)
  error.value = validatePetAge(value)
  if (!error.value) form.completeStep({ petAge: value })
}
</script>

<template>
  <StepShell :title="`How old is ${form.profile.petName}?`" @submit="submit">
    <BaseInput
      v-model="age"
      label="Age"
      inputmode="numeric"
      unit="years"
      hint="Under a year? Enter 0."
      :error="error"
    />
  </StepShell>
</template>
