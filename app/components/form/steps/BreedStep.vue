<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseSelect from '~/components/base/BaseSelect.vue'
import StepShell from '~/components/form/StepShell.vue'
import type { Breed } from '~/domain/form/entities'
import { getDependencies } from '~/infrastructure/dependencies'
import { useFormStore } from '~/stores/form'

const form = useFormStore()
const { breeds: breedRepository } = getDependencies()

const breeds = ref<Breed[]>([])
const status = ref<'loading' | 'ready' | 'error'>('loading')
const selectedId = ref('')
const image = ref<string | null>(form.profile.breedImage)
const error = ref<string | null>(null)

const options = computed(() => breeds.value.map((b) => ({ value: b.id, label: b.name })))
const selected = computed(() => breeds.value.find((b) => b.id === selectedId.value))

async function loadBreeds() {
  status.value = 'loading'
  try {
    breeds.value = await breedRepository.list()
    selectedId.value = breeds.value.find((b) => b.name === form.profile.breed)?.id ?? ''
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
}

watch(selectedId, async (id, previous) => {
  error.value = null
  if (!id || (previous === '' && image.value)) return
  image.value = null
  image.value = await breedRepository.randomImage(id)
})

function submit() {
  if (!selected.value) {
    error.value = 'Choose a breed to continue.'
    return
  }
  form.completeStep({ breed: selected.value.name, breedImage: image.value })
}

onMounted(loadBreeds)
</script>

<template>
  <StepShell title="What breed is your dog?" @submit="submit">
    <div v-if="status === 'error'" role="alert" class="grid justify-items-start gap-3 rounded-card border border-danger bg-surface p-5">
      <p class="font-semibold">We couldn't load the list of breeds.</p>
      <BaseButton variant="secondary" @click="loadBreeds">Try again</BaseButton>
    </div>

    <BaseSelect
      v-else
      v-model="selectedId"
      label="Breed"
      :options="options"
      :disabled="status === 'loading'"
      :placeholder="status === 'loading' ? 'Loading breeds…' : 'Choose a breed'"
      :error="error"
      data-testid="breed-select"
    />

    <img
      v-if="image && selected"
      :src="image"
      :alt="`A ${selected.name}`"
      class="aspect-[4/3] w-full rounded-card object-cover"
    />
  </StepShell>
</template>
