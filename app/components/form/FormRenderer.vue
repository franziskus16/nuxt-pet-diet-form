<script setup lang="ts">
import { onMounted } from 'vue'
import ChoiceStep from '~/components/form/steps/ChoiceStep.vue'
import BreedStep from '~/components/form/steps/BreedStep.vue'
import PetAgeStep from '~/components/form/steps/PetAgeStep.vue'
import PetNameStep from '~/components/form/steps/PetNameStep.vue'
import PetWeightStep from '~/components/form/steps/PetWeightStep.vue'
import SummaryStep from '~/components/form/steps/SummaryStep.vue'
import ProgressBar from '~/components/common/ProgressBar.vue'
import { activityLevelOptions, dietGoalOptions, foodBehaviourOptions } from '~/components/form/options'
import { FormStep } from '~/domain/form/entities'
import { useFormStore } from '~/stores/form'

const form = useFormStore()

onMounted(() => form.init())
</script>

<template>
  <div v-if="form.ready" class="grid gap-10">
    <ProgressBar :position="form.progress.position" :total="form.progress.total" />

    <Transition mode="out-in" enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <BreedStep v-if="form.step === FormStep.Breed" :key="FormStep.Breed" />
      <PetNameStep v-else-if="form.step === FormStep.PetName" :key="FormStep.PetName" />
      <PetAgeStep v-else-if="form.step === FormStep.PetAge" :key="FormStep.PetAge" />
      <PetWeightStep v-else-if="form.step === FormStep.PetWeight" :key="FormStep.PetWeight" />
      <ChoiceStep
        v-else-if="form.step === FormStep.DietGoal"
        :key="FormStep.DietGoal"
        :title="`What's the goal for ${form.profile.petName}?`"
        legend="Diet goal"
        :options="dietGoalOptions"
        :initial="form.profile.dietGoal"
        @answer="(dietGoal) => form.completeStep({ dietGoal })"
      />
      <ChoiceStep
        v-else-if="form.step === FormStep.FoodBehaviour"
        :key="FormStep.FoodBehaviour"
        :title="`How does ${form.profile.petName} behave at mealtime?`"
        legend="Eating style"
        :options="foodBehaviourOptions"
        :initial="form.profile.foodBehaviour"
        @answer="(foodBehaviour) => form.completeStep({ foodBehaviour })"
      />
      <ChoiceStep
        v-else-if="form.step === FormStep.ActivityLevel"
        :key="FormStep.ActivityLevel"
        :title="`How active is ${form.profile.petName}?`"
        legend="Activity level"
        :options="activityLevelOptions"
        :initial="form.profile.activityLevel"
        @answer="(activityLevel) => form.completeStep({ activityLevel })"
      />
      <SummaryStep v-else :key="FormStep.Summary" />
    </Transition>
  </div>
  <p v-else class="text-muted" role="status">Loading…</p>
</template>
