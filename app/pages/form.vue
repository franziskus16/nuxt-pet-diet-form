<script setup lang="ts">
useHead({ title: 'Questionnaire · Pet Meal Planner' })
</script>

<template>
  <div class="mx-auto w-full max-w-xl px-5 py-12 sm:py-16">
    <!-- The form reads localStorage, so it only renders in the browser. -->
    <ClientOnly>
      <FormRenderer />
      <template #fallback>
        <p class="text-muted" role="status">Loading…</p>
      </template>
    </ClientOnly>
  </div>
</template>
