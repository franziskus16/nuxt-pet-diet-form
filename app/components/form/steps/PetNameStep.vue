<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '~/components/base/BaseInput.vue'
import StepShell from '~/components/form/StepShell.vue'
import { validatePetName } from '~/domain/form/validation'
import { useFormStore } from '~/stores/form'

const form = useFormStore()
const name = ref(form.profile.petName)
const error = ref<string | null>(null)

function submit() {
  error.value = validatePetName(name.value)
  if (!error.value) form.completeStep({ petName: name.value.trim() })
}
</script>

<template>
  <StepShell :title="`What's your ${form.profile.breed || 'dog'}'s name?`" @submit="submit">
    <img
      v-if="form.profile.breedImage"
      :src="form.profile.breedImage"
      :alt="`A ${form.profile.breed}`"
      class="h-40 w-40 rounded-full object-cover"
    />
    <BaseInput v-model="name" label="Name" autocomplete="off" :error="error" />
  </StepShell>
</template>
