<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import StepShell from '~/components/form/StepShell.vue'
import { activityLevelOptions, dietGoalOptions, foodBehaviourOptions, labelFor } from '~/components/form/options'
import { FormStep } from '~/domain/form/entities'
import { useFormStore } from '~/stores/form'

const form = useFormStore()

const rows = computed(() => {
  const p = form.profile
  const list = [
    { label: 'Breed', value: p.breed },
    { label: 'Name', value: p.petName },
    { label: 'Age', value: `${p.petAge} ${p.petAge === 1 ? 'year' : 'years'}` },
    { label: 'Weight', value: `${p.petWeight} kg` },
    { label: 'Goal', value: labelFor(dietGoalOptions, p.dietGoal) },
    { label: 'Eating style', value: labelFor(foodBehaviourOptions, p.foodBehaviour) },
  ]
  if (form.steps.includes(FormStep.ActivityLevel)) {
    list.push({ label: 'Activity', value: labelFor(activityLevelOptions, p.activityLevel) })
  }
  return list
})
</script>

<template>
  <div v-if="form.submitted" class="grid gap-6" role="status" data-testid="success-message">
    <h1 class="text-3xl font-semibold sm:text-4xl">{{ form.profile.petName }}'s plan is on its way.</h1>
    <p class="text-lg text-muted">This is a demo, so nothing was sent. Your answers were tracked as a <code>form_completed</code> event in <code>window.dataLayer</code>.</p>
    <div><BaseButton variant="secondary" @click="form.restart()">Start again</BaseButton></div>
  </div>

  <StepShell v-else :title="`Here's ${form.profile.petName}'s profile`" submit-label="Get the plan" @submit="form.submit()">
    <dl class="grid gap-0 rounded-card border border-line bg-surface px-5">
      <div v-for="row in rows" :key="row.label" class="flex justify-between gap-4 border-b border-line py-3 last:border-0">
        <dt class="text-muted">{{ row.label }}</dt>
        <dd class="text-right font-semibold">{{ row.value }}</dd>
      </div>
    </dl>
    <p class="text-sm text-muted">A/B test group: <strong>{{ form.group }}</strong></p>
  </StepShell>
</template>
