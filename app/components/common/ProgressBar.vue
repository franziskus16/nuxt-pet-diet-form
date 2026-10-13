<script setup lang="ts">
const props = defineProps<{ position: number; total: number }>()
</script>

<template>
  <div class="grid gap-2">
    <p class="text-sm font-semibold text-muted">Step {{ props.position }} of {{ props.total }}</p>
    <div
      role="progressbar"
      :aria-valuenow="props.position"
      aria-valuemin="1"
      :aria-valuemax="props.total"
      :aria-valuetext="`Step ${props.position} of ${props.total}`"
      class="h-2 w-full overflow-hidden rounded-full bg-line"
    >
      <div
        class="h-full rounded-full bg-brand transition-[width] duration-300"
        :style="{ width: `${(props.position / props.total) * 100}%` }"
      />
    </div>
  </div>
</template>
