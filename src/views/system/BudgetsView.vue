<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import MonthOverview from '@/components/MonthOverview.vue'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency } from '@/utils/formatters'
const store = useFinanceStore()
const dialog = ref(false)
const form = ref(null)
const draft = ref({ category: '', amount: '' })
const removing = ref(null)
const confirmRemoval = item => { removing.value = item; store.error = '' }
const categories = computed(() => [
  { title: 'Overall monthly budget', value: '' },
  ...store.categories.map((c) => ({ title: c.name, value: c.id })),
])
const open = (budget = null) => {
  store.error = ''
  draft.value = {
    category: budget?.category || '',
    amount: budget?.amount || '',
    month: store.selectedMonth,
  }
  dialog.value = true
}
const save = async () => {
  if (!(await form.value.validate()).valid) return
  if (await store.saveBudget(draft.value)) dialog.value = false
}
const remove = async () => {
  if (await store.deleteBudget(removing.value.id)) removing.value = null
}
const color = (b) =>
  b.status === 'over' ? 'error' : b.status === 'warning' ? 'warning' : 'success'
onMounted(() => store.init())
</script>

<template>
  <DashboardLayout pageTitle="Budgets" activeItem="budgets">
    <MonthOverview />
    <div class="d-flex flex-wrap justify-space-between align-center ga-3 mb-6">
      <div>
        <h1 class="text-h5">Give your spending a plan</h1>
        <p class="text-medium-emphasis">
          Set an overall limit, then add limits for the categories that matter.
        </p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" :disabled="store.isLoading" @click="open()"
        >Set budget</v-btn
      >
    </div>
    <v-alert type="info" variant="tonal" class="mb-6"
      >Budgets apply to the selected month. Category limits are part of your overall limit, not
      extra spending money. Transfers do not count as spending.</v-alert
    >
    <v-row v-if="store.monthBudgets.length">
      <v-col v-for="budget in store.monthBudgets" :key="budget.id" cols="12" md="6">
        <v-card rounded="xl" border>
          <v-card-title class="d-flex align-center"
            >{{ budget.name }}<v-spacer /><v-chip :color="color(budget)" size="small">{{
              budget.status === 'over'
                ? 'Over budget'
                : budget.status === 'warning'
                  ? 'Near limit'
                  : 'On track'
            }}</v-chip></v-card-title
          >
          <v-card-text
            ><p class="text-h5 mb-2">
              {{ formatCurrency(budget.spent) }}
              <span class="text-body-2 text-medium-emphasis"
                >of {{ formatCurrency(budget.limit) }}</span
              >
            </p>
            <v-progress-linear
              :model-value="Math.min(budget.percent, 100)"
              :color="color(budget)"
              height="10"
              rounded
            />
            <p class="mt-3">
              {{ formatCurrency(Math.abs(budget.remaining)) }}
              {{ budget.remaining < 0 ? 'over the limit' : 'remaining' }}
            </p></v-card-text
          >
          <v-card-actions
            ><v-btn @click="open(budget)">Edit limit</v-btn><v-spacer /><v-btn
              color="error"
              @click="confirmRemoval(budget)"
              >Remove</v-btn
            ></v-card-actions
          >
        </v-card>
      </v-col>
    </v-row>
    <v-card v-else class="pa-8 text-center" variant="outlined"
      ><v-icon size="48" color="primary">mdi-chart-donut</v-icon>
      <h2 class="text-h6 mt-3">No budgets for this month yet</h2>
      <p class="my-3">Start with how much you want to spend in total.</p>
      <v-btn color="primary" @click="open()">Create your first budget</v-btn></v-card
    >
    <v-dialog v-model="dialog" max-width="480" :persistent="store.isSaving">
      <v-card title="Set spending limit"
        ><v-form ref="form" @submit.prevent="save"
          ><v-card-text>
            <v-alert v-if="store.error" type="error" class="mb-4">{{ store.error }}</v-alert>
            <v-text-field
              v-model="draft.month"
              label="Month"
              type="month"
              :rules="[(v) => !!v || 'Choose a month']"
            />
            <v-select v-model="draft.category" :items="categories" label="Budget for" />
            <v-text-field
              v-model="draft.amount"
              type="number"
              prefix="₱"
              label="Spending limit"
              min="0.01"
              step="0.01"
              :rules="[(v) => Number(v) > 0 || 'Enter a positive amount']"
            />
            <p class="text-caption">
              Saving updates an existing limit for the same month and category.
            </p> </v-card-text
          ><v-card-actions
            ><v-spacer /><v-btn :disabled="store.isSaving" @click="dialog = false">Cancel</v-btn
            ><v-btn type="submit" color="primary" :loading="store.isSaving"
              >Save budget</v-btn
            ></v-card-actions
          ></v-form
        ></v-card
      >
    </v-dialog>
    <v-dialog
      :model-value="!!removing"
      max-width="440"
      :persistent="store.isSaving"
      @update:model-value="!$event && (removing = null)"
      ><v-card title="Remove this budget?"
        ><v-card-text
          >Your transactions will stay unchanged.<v-alert v-if="store.error" type="error">{{
            store.error
          }}</v-alert></v-card-text
        ><v-card-actions
          ><v-btn @click="removing = null">Cancel</v-btn><v-spacer /><v-btn
            color="error"
            :loading="store.isSaving"
            @click="remove"
            >Remove budget</v-btn
          ></v-card-actions
        ></v-card
      ></v-dialog
    >
  </DashboardLayout>
</template>

