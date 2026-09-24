<script setup>
import { computed } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency } from '@/utils/formatters'

const store = useFinanceStore()
const color = computed(() =>
  store.overallBudget?.status === 'over'
    ? 'error'
    : store.overallBudget?.status === 'warning'
      ? 'warning'
      : 'primary',
)
const statusLabel = computed(() => {
  if (!store.overallBudget) return 'No budget set'
  if (store.overallBudget.status === 'over') return 'Over budget'
  if (store.overallBudget.status === 'warning') return 'Near your limit'
  return 'Spending on track'
})
</script>

<template>
  <v-card class="month-card mb-5" color="surface">
    <v-card-text class="pa-5 pa-md-6">
      <div class="overview-header">
        <div>
          <div class="eyebrow mb-2">Monthly snapshot</div>
          <h2 class="section-heading">Where your money stands</h2>
        </div>
        <v-text-field
          v-model="store.selectedMonth"
          type="month"
          label="Viewing month"
          hide-details
          density="compact"
          variant="outlined"
          class="month-picker"
        />
      </div>

      <div class="money-grid">
        <div class="money-stat">
          <div class="stat-icon income"><v-icon size="19">mdi-arrow-down-left</v-icon></div>
          <div><div class="stat-label">Money in</div><div class="stat-value">{{ formatCurrency(store.monthly.income) }}</div></div>
        </div>
        <div class="money-stat">
          <div class="stat-icon expense"><v-icon size="19">mdi-arrow-up-right</v-icon></div>
          <div><div class="stat-label">Money out</div><div class="stat-value">{{ formatCurrency(store.monthly.expenses) }}</div></div>
        </div>
        <div class="money-stat">
          <div class="stat-icon retained"><v-icon size="19">mdi-wallet-outline</v-icon></div>
          <div>
            <div class="stat-label">{{ store.monthly.retained < 0 ? 'Beyond income' : 'Kept this month' }}</div>
            <div class="stat-value">{{ formatCurrency(Math.abs(store.monthly.retained)) }}</div>
          </div>
        </div>
      </div>

      <div v-if="store.overallBudget" class="budget-strip">
        <div class="budget-copy">
          <div class="d-flex align-center ga-2">
            <span class="status-dot" :class="color"></span>
            <strong>{{ statusLabel }}</strong>
          </div>
          <span class="text-medium-emphasis">
            {{ store.overallBudget.remaining < 0 ? 'Over by' : 'Available' }}
            {{ formatCurrency(Math.abs(store.overallBudget.remaining)) }}
          </span>
        </div>
        <v-progress-linear :model-value="Math.min(100, store.overallBudget.percent)" :color="color" height="8" rounded aria-label="Monthly budget used" />
        <div class="d-flex justify-space-between mt-2 text-caption text-medium-emphasis">
          <span>{{ store.overallBudget.percent }}% used</span>
          <span>{{ formatCurrency(store.overallBudget.limit) }} limit</span>
        </div>
      </div>
      <div v-else class="budget-empty">
        <div>
          <strong>Set a spending limit</strong>
          <p class="text-body-2 text-medium-emphasis">See how much is safe to spend throughout the month.</p>
        </div>
        <v-btn to="/budgets" color="primary" variant="tonal">Create budget</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.month-card { overflow: hidden; background-image: radial-gradient(circle at 100% 0, rgba(var(--v-theme-primary), .10), transparent 34%); }
.overview-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 24px; }
.month-picker { max-width: 205px; min-width: 180px; }
.money-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 22px; }
.money-stat { display: flex; align-items: center; gap: 12px; min-width: 0; padding: 14px; border-radius: 13px; background: rgba(var(--v-theme-on-surface), .035); }
.stat-icon { flex: 0 0 38px; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px; }
.stat-icon.income { color: rgb(var(--v-theme-success)); background: rgba(var(--v-theme-success), .12); }
.stat-icon.expense { color: rgb(var(--v-theme-error)); background: rgba(var(--v-theme-error), .10); }
.stat-icon.retained { color: rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-primary), .10); }
.stat-label { color: rgba(var(--v-theme-on-surface), .58); font-size: .76rem; font-weight: 600; }
.stat-value { margin-top: 2px; font-size: 1.15rem; font-weight: 750; letter-spacing: -.035em; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.budget-strip { padding-top: 20px; border-top: 1px solid rgba(var(--v-border-color), .48); }
.budget-copy { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; font-size: .83rem; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: rgb(var(--v-theme-primary)); }
.status-dot.warning { background: rgb(var(--v-theme-warning)); }
.status-dot.error { background: rgb(var(--v-theme-error)); }
.budget-empty { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 20px; border-top: 1px solid rgba(var(--v-border-color), .48); }
@media (max-width: 700px) {
  .overview-header { flex-direction: column; }
  .month-picker { width: 100%; max-width: none; }
  .money-grid { grid-template-columns: 1fr; }
}
@media (max-width: 450px) {
  .budget-copy, .budget-empty { align-items: flex-start; flex-direction: column; }
}
</style>
