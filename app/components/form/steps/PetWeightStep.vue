<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '~/components/base/BaseInput.vue'
import StepShell from '~/components/form/StepShell.vue'
import { validatePetWeight } from '~/domain/form/validation'
import { useFormStore } from '~/stores/form'

const form = useFormStore()
const weight = ref(form.profile.petWeight?.toString() ?? '')
const error = ref<string | null>(null)

function submit() {
  const raw = weight.value.trim().replace(',', '.')
  const value = raw === '' ? null : Number(raw)
  error.value = validatePetWeight(value)
  if (!error.value) form.completeStep({ petWeight: value })
}
</script>

<template>
  <StepShell :title="`How much does ${form.profile.petName} weigh?`" @submit="submit">
    <BaseInput v-model="weight" label="Weight" inputmode="decimal" unit="kg" :error="error" />
  </StepShell>
</template>
