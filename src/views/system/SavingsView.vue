<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency, formatDate } from '@/utils/formatters'
const store = useFinanceStore()
const dialog = ref(false)
const form = ref(null)
const draft = ref({})
const removing = ref(null)
const confirmRemoval = item => { removing.value = item; store.error = '' }
const accounts = computed(() =>
  store.accounts.filter((a) => a.type === 'savings').map((a) => ({ title: a.name, value: a.id })),
)
const open = (goal = null) => {
  store.error = ''
  draft.value = goal
    ? { ...goal }
    : { name: '', account: accounts.value[0]?.value || '', target: '', deadline: '' }
  dialog.value = true
}
const save = async () => {
  if (!(await form.value.validate()).valid) return
  if (await store.saveGoal(draft.value)) dialog.value = false
}
const remove = async () => {
  if (await store.deleteGoal(removing.value.id)) removing.value = null
}
onMounted(() => store.init())
</script>

<template>
  <DashboardLayout pageTitle="Savings" activeItem="savings">
    <v-card color="primary" variant="tonal" rounded="xl" class="mb-6 pa-2"
      ><v-card-text
        ><p class="text-overline">Across your savings accounts</p>
        <h1 class="text-h3 font-weight-bold">{{ formatCurrency(store.savingsBalance) }}</h1>
        <p class="mt-3">
          Build a buffer, save for something meaningful, and watch it grow.
        </p></v-card-text
      ></v-card
    >
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-6">
      <div>
        <h2 class="text-h5">Your savings goals</h2>
        <p class="text-medium-emphasis">Each goal follows the balance of one savings account.</p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        :disabled="!accounts.length || store.isLoading"
        @click="open()"
        >New goal</v-btn
      >
    </div>
    <v-alert v-if="!accounts.length && !store.isLoading" type="info" variant="tonal" class="mb-6"
      >Start by adding an account with the type “Savings” on your Dashboard.<v-btn
        class="ml-2"
        to="/dashboard"
        variant="text"
        >Go to accounts</v-btn
      ></v-alert
    >
    <v-alert v-else type="info" variant="tonal" class="mb-6"
      >To put money aside, record a transfer from your cash or checking account to savings. It moves
      your money without inflating expenses or income. One account can fund one goal.</v-alert
    >
    <v-row v-if="store.goals.length"
      ><v-col v-for="goal in store.goals" :key="goal.id" cols="12" md="6"
        ><v-card rounded="xl" border>
          <v-card-title class="d-flex align-center"
            >{{ goal.name }}<v-spacer /><v-chip
              :color="goal.completed ? 'success' : goal.overdue ? 'warning' : 'primary'"
              size="small"
              >{{
                goal.completed ? 'Goal reached!' : goal.overdue ? 'Past target date' : 'In progress'
              }}</v-chip
            ></v-card-title
          >
          <v-card-subtitle>{{ store.accountName(goal.account) }}</v-card-subtitle>
          <v-card-text
            ><div class="text-h5 mb-3">
              {{ formatCurrency(goal.saved) }}
              <span class="text-body-2">of {{ formatCurrency(goal.target) }}</span>
            </div>
            <v-progress-linear
              :model-value="Math.min(goal.percent, 100)"
              color="success"
              height="12"
              rounded
            />
            <p class="mt-3">
              {{
                goal.completed
                  ? 'You have enough saved for this goal.'
                  : `${formatCurrency(goal.remaining)} left to save`
              }}
            </p>
            <p v-if="goal.deadline" class="text-medium-emphasis mt-1">
              Target: {{ formatDate(goal.deadline) }}
            </p></v-card-text
          >
          <v-card-actions
            ><v-btn @click="open(goal)">Edit goal</v-btn><v-spacer /><v-btn
              color="error"
              @click="confirmRemoval(goal)"
              >Remove</v-btn
            ></v-card-actions
          >
        </v-card></v-col
      ></v-row
    >
    <v-card v-else variant="outlined" class="pa-8 text-center"
      ><v-icon size="48" color="success">mdi-piggy-bank-outline</v-icon>
      <h2 class="text-h6 mt-3">What are you saving for?</h2>
      <p class="mt-2">
        An emergency fund, a trip, or your next big purchase — give it a name and a target.
      </p></v-card
    >
    <v-dialog v-model="dialog" max-width="480" :persistent="store.isSaving"
      ><v-card title="Savings goal"
        ><v-form ref="form" @submit.prevent="save"
          ><v-card-text>
            <v-alert v-if="store.error" type="error" class="mb-4">{{ store.error }}</v-alert>
            <v-text-field
              v-model="draft.name"
              label="Goal name"
              placeholder="Emergency fund"
              maxlength="80"
              counter
              :rules="[(v) => !!v?.trim() || 'Name your goal']"
            />
            <v-select
              v-model="draft.account"
              :items="accounts"
              label="Savings account"
              :rules="[(v) => !!v || 'Choose an account']"
            />
            <v-text-field
              v-model="draft.target"
              type="number"
              min="0.01"
              step="0.01"
              prefix="₱"
              label="Target amount"
              :rules="[(v) => Number(v) > 0 || 'Enter a positive target']"
            />
            <v-text-field
              v-model="draft.deadline"
              type="date"
              label="Target date (optional)"
              clearable
            /> </v-card-text
          ><v-card-actions
            ><v-spacer /><v-btn :disabled="store.isSaving" @click="dialog = false">Cancel</v-btn
            ><v-btn type="submit" color="primary" :loading="store.isSaving"
              >Save goal</v-btn
            ></v-card-actions
          ></v-form
        ></v-card
      ></v-dialog
    >
    <v-dialog
      :model-value="!!removing"
      max-width="440"
      :persistent="store.isSaving"
      @update:model-value="!$event && (removing = null)"
      ><v-card title="Remove savings goal?"
        ><v-card-text
          >The savings account and its money remain unchanged.<v-alert
            v-if="store.error"
            type="error"
            >{{ store.error }}</v-alert
          ></v-card-text
        ><v-card-actions
          ><v-btn @click="removing = null">Cancel</v-btn><v-spacer /><v-btn
            color="error"
            :loading="store.isSaving"
            @click="remove"
            >Remove goal</v-btn
          ></v-card-actions
        ></v-card
      ></v-dialog
    >
  </DashboardLayout>
</template>
