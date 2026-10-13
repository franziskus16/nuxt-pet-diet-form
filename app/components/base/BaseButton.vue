<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', disabled: false },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="
      variant === 'primary'
        ? 'bg-brand text-white hover:bg-brand-dark'
        : 'border border-line bg-surface text-ink hover:border-ink'
    "
  >
    <slot />
  </button>
</template>
