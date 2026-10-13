<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import { useFormStore } from '~/stores/form'

/**
 * Shared frame for every step: heading, back/next buttons and keyboard
 * submit. Moves focus to the heading when a step appears so screen-reader
 * and keyboard users know the content changed.
 */
defineProps<{
  title: string
  submitLabel?: string
}>()

const emit = defineEmits<{ submit: [] }>()

const form = useFormStore()
const heading = ref<HTMLHeadingElement | null>(null)

onMounted(async () => {
  await nextTick()
  heading.value?.focus()
})
</script>

<template>
  <form class="grid gap-8" novalidate @submit.prevent="emit('submit')">
    <h1 ref="heading" tabindex="-1" class="text-3xl font-semibold leading-tight outline-none sm:text-4xl">
      {{ title }}
    </h1>

    <div class="grid gap-4">
      <slot />
    </div>

    <div class="flex flex-wrap-reverse items-center justify-between gap-3">
      <BaseButton v-if="!form.isFirstStep" variant="secondary" @click="form.goBack()">
        Back
      </BaseButton>
      <span v-else />
      <BaseButton type="submit">{{ submitLabel ?? 'Continue' }}</BaseButton>
    </div>
  </form>
</template>
