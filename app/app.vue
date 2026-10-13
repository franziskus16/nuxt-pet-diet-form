<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#main"
      class="absolute -top-20 left-4 z-10 rounded-field bg-brand px-4 py-3 text-white focus:top-4"
      >Skip to content</a
    >
    <AppHeader />
    <main id="main" class="flex-1" tabindex="-1">
      <NuxtPage />
    </main>
    <footer class="border-t border-line">
      <p class="mx-auto max-w-5xl px-5 py-6 text-sm text-muted">
        Demo project by Francesc Gimenez · Breed photos from the
        <a href="https://dog.ceo/dog-api/" class="underline underline-offset-4">Dog CEO API</a>
      </p>
    </footer>
  </div>
</template>
