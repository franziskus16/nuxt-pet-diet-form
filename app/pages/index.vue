<script setup lang="ts">
useHead({ title: 'Pet Meal Planner' })
</script>

<template>
  <section class="mx-auto grid max-w-5xl items-center gap-12 px-5 py-16 sm:py-24 md:grid-cols-[1.2fr_1fr]">
    <div class="grid gap-6">
      <p class="text-sm font-semibold uppercase tracking-widest text-brand">2 minutes · 8 questions</p>
      <h1 class="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
        A meal plan that fits your dog, not the average dog.
      </h1>
      <p class="max-w-prose text-xl text-muted">
        Tell us about your dog's breed, age, weight and habits, and we'll build a profile for a
        tailored meal plan.
      </p>
      <div>
        <NuxtLink
          to="/form"
          class="inline-flex min-h-12 items-center rounded-full bg-brand px-7 text-base font-semibold text-white no-underline hover:bg-brand-dark"
        >
          Start the questionnaire
        </NuxtLink>
      </div>
    </div>

    <div class="relative mx-auto aspect-square w-full max-w-sm" aria-hidden="true">
      <div class="absolute inset-0 rounded-full bg-brand-soft" />
      <svg viewBox="0 0 200 200" class="relative h-full w-full">
        <ellipse cx="100" cy="150" rx="72" ry="10" fill="#1d2a24" opacity=".08" />
        <path d="M30 105h140a70 42 0 0 1-140 0Z" fill="#2f6b4f" />
        <path d="M30 105h140" stroke="#23523c" stroke-width="6" stroke-linecap="round" />
        <circle cx="72" cy="92" r="11" fill="#c98b4a" />
        <circle cx="96" cy="86" r="12" fill="#a8693a" />
        <circle cx="120" cy="92" r="11" fill="#c98b4a" />
        <circle cx="108" cy="98" r="9" fill="#e0a868" />
        <circle cx="84" cy="99" r="9" fill="#e0a868" />
        <path d="M86 122c4 7 24 7 28 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" />
      </svg>
    </div>
  </section>
</template>
