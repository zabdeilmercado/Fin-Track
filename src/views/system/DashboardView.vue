<script setup>
import { today } from '@/utils/financeMath'
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import {
  formatCurrency,
  formatDate,
  getCategoryColor,
  getCategoryIcon,
  getAccountColor,
  getAccountIcon,
} from '@/utils/formatters'
import DashboardLayout from '@/components/DashboardLayout.vue'
import EmptyState from '@/components/EmptyState.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import MonthOverview from '@/components/MonthOverview.vue'
import AccountForm from '@/components/AccountForm.vue'

const financeStore = useFinanceStore()

const monthlySummary = computed(() => {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const entries = financeStore.transactions.filter((t) => t.date.startsWith(key))
    return {
      label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      income: entries.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: entries.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    }
  })
})
const chartMax = computed(() =>
  Math.max(1, ...monthlySummary.value.flatMap((m) => [m.income, m.expense])),
)

// Dialog state
const transactionDialog = ref(false)
const accountDialog = ref(false)
const deleteAccountDialog = ref(false)
const isEditMode = ref(false)
const selectedTransaction = ref(null)
const selectedAccount = ref(null)

// Form data
const transactionData = ref({
  id: null,
  description: '',
  amount: 0,
  type: 'expense',
  date: today(),
  category: '',
  account: '',
  notes: '',
})

const accountData = ref({
  id: null,
  name: '',
  type: 'checking',
  balance: 0,
  notes: '',
})

// Computed properties
const hasTransactionData = computed(() => {
  return financeStore.transactions.length > 0
})

const accountOptions = computed(() => {
  return financeStore.accounts.map((account) => ({
    title: account.name,
    value: account.id,
  }))
})

// Transaction methods
const openNewTransactionDialog = () => {
  isEditMode.value = false
  transactionData.value = {
    id: null,
    description: '',
    amount: 0,
    type: 'expense',
    date: today(),
    category: '',
    account: financeStore.accounts.length > 0 ? financeStore.accounts[0].id : '',
    notes: '',
  }
  if (!financeStore.accounts.length) {
    openNewAccountDialog()
    return
  }
  financeStore.error = ''
  transactionDialog.value = true
}

const closeTransactionDialog = () => {
  transactionDialog.value = false
}

const saveTransaction = async (transaction) => {
  if (isEditMode.value && selectedTransaction.value) {
    if (!(await financeStore.updateTransaction(selectedTransaction.value.id, transaction))) return
  } else {
    if (!(await financeStore.addTransaction(transaction))) return
  }
  closeTransactionDialog()
}

// Account methods
const openNewAccountDialog = () => {
  isEditMode.value = false
  accountData.value = {
    id: null,
    name: '',
    type: 'checking',
    balance: 0,
    notes: '',
  }
  financeStore.error = ''
  accountDialog.value = true
}

const openEditAccountDialog = (account) => {
  isEditMode.value = true
  selectedAccount.value = account
  accountData.value = { ...account }
  financeStore.error = ''
  accountDialog.value = true
}

const openDeleteAccountDialog = (account) => {
  selectedAccount.value = account
  deleteAccountDialog.value = true
}

const closeAccountDialog = () => {
  accountDialog.value = false
}

const closeDeleteAccountDialog = () => {
  deleteAccountDialog.value = false
}

const deleteAccount = async () => {
  if (!(await financeStore.deleteAccount(selectedAccount.value.id))) return
  closeDeleteAccountDialog()
}

const saveAccount = async (account) => {
  if (isEditMode.value && selectedAccount.value) {
    if (!(await financeStore.updateAccount(selectedAccount.value.id, account))) return
  } else {
    if (!(await financeStore.addAccount(account))) return
  }
  closeAccountDialog()
}

onMounted(() => {
  financeStore.init()
})
</script>

<template>
  <DashboardLayout pageTitle="My finances" activeItem="dashboard">
    <header class="page-header">
      <div>
        <div class="eyebrow mb-2">Overview</div>
        <h1 class="page-heading">Your financial home</h1>
        <p class="page-description mt-2">Track what comes in, what goes out, and what you’re building toward.</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="openNewTransactionDialog">Add transaction</v-btn>
    </header>

    <MonthOverview />
    <v-alert
      v-if="!financeStore.accounts.length && !financeStore.isLoading"
      type="info"
      variant="tonal"
      class="mb-6"
      >Start with your current balances: add a Cash, Checking, or Savings account, then record your
      income and expenses.
      <v-btn variant="text" @click="openNewAccountDialog">Add first account</v-btn></v-alert
    >
    <v-row class="metric-row">
      <v-col cols="12" sm="6" md="3">
        <v-card class="h-100 metric-card interactive-card">
          <v-card-text class="pa-5">
            <div class="metric-top"><div class="eyebrow">Total balance</div><v-icon color="primary">mdi-wallet-outline</v-icon></div>
            <div class="metric-value mt-4">{{ formatCurrency(financeStore.totalBalance) }}</div>
            <div class="metric-hint">Across all your accounts</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="h-100 metric-card interactive-card">
          <v-card-text class="pa-5">
            <div class="metric-top"><div class="eyebrow">Total income</div><v-icon color="success">mdi-trending-up</v-icon></div>
            <div class="metric-value mt-4 text-success">{{ formatCurrency(financeStore.totalIncome) }}</div>
            <div class="metric-hint">All recorded income</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="h-100 metric-card interactive-card">
          <v-card-text class="pa-5">
            <div class="metric-top"><div class="eyebrow">Total spent</div><v-icon color="error">mdi-trending-down</v-icon></div>
            <div class="metric-value mt-4 text-error">{{ formatCurrency(financeStore.totalExpenses) }}</div>
            <div class="metric-hint">All recorded expenses</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="h-100 metric-card interactive-card">
          <v-card-text class="pa-5">
            <div class="metric-top"><div class="eyebrow">Savings rate</div><v-icon color="secondary">mdi-piggy-bank-outline</v-icon></div>
            <div class="metric-value mt-4">{{ financeStore.savingsRate }}%</div>
            <div class="metric-hint">Income kept after expenses</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row class="mt-2">
      <v-col cols="12" md="8">
        <v-card class="h-100">
          <v-card-title class="pa-5 pb-1">Cash flow</v-card-title>
          <v-card-subtitle>Income and spending over the last six months</v-card-subtitle>
          <v-card-text style="height: 300px">
            <v-sheet class="d-flex justify-center align-center" height="100%">
              <template v-if="hasTransactionData">
                <div
                  class="w-100 pa-2"
                  style="overflow-y: auto; max-height: 260px"
                  aria-label="Income and expenses for the last six months"
                >
                  <div v-for="month in monthlySummary" :key="month.label" class="mb-2">
                    <div class="text-caption">
                      {{ month.label }} · Income {{ formatCurrency(month.income) }} · Expenses
                      {{ formatCurrency(month.expense) }}
                    </div>
                    <v-progress-linear
                      :model-value="(month.income / chartMax) * 100"
                      color="success"
                      height="7"
                      class="mb-1"
                    />
                    <v-progress-linear
                      :model-value="(month.expense / chartMax) * 100"
                      color="error"
                      height="7"
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <EmptyState
                  icon="mdi-chart-line"
                  title="No Data Available"
                  description="Add transactions to see your financial trends"
                  actionText="Add Your First Transaction"
                  actionIcon="mdi-plus"
                  @action="openNewTransactionDialog"
                />
              </template>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="h-100">
          <v-card-title class="pa-5 pb-1">Spending by category</v-card-title>
          <v-card-subtitle>Where your money has gone</v-card-subtitle>
          <v-card-text style="height: 300px">
            <v-sheet class="d-flex justify-center align-center" height="100%">
              <template v-if="hasTransactionData">
                <div class="w-100 pa-2" style="overflow-y: auto; max-height: 260px">
                  <div
                    v-for="category in financeStore.categories.filter((c) => c.amount > 0)"
                    :key="category.id"
                    class="mb-3"
                  >
                    <div class="d-flex justify-space-between text-caption">
                      <span>{{ category.name }}</span
                      ><span>{{ formatCurrency(category.amount) }}</span>
                    </div>
                    <v-progress-linear
                      :model-value="category.percentage"
                      :color="category.color"
                      height="10"
                      rounded
                    />
                  </div>
                  <p v-if="!financeStore.totalExpenses" class="text-medium-emphasis">
                    No expenses yet.
                  </p>
                </div>
              </template>
              <template v-else>
                <EmptyState
                  icon="mdi-chart-pie"
                  title="No Data Available"
                  description="Add transactions to see your expense breakdown"
                />
              </template>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Accounts Section -->
    <v-row class="mt-3">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <div><div class="eyebrow mb-1">Balances</div><h2 class="section-heading">Your accounts</h2></div>
          <v-btn
            color="primary"
            variant="text"
            prepend-icon="mdi-plus"
            @click="openNewAccountDialog"
          >
            Add Account
          </v-btn>
        </div>

        <v-row v-if="financeStore.accounts.length > 0">
          <v-col
            v-for="(account, index) in financeStore.accounts"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="h-100 interactive-card">
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar :color="getAccountColor(account.type)" size="40" variant="tonal">
                    <v-icon>{{ getAccountIcon(account.type) }}</v-icon>
                  </v-avatar>
                </template>
                <v-card-title>{{ account.name }}</v-card-title>
                <template v-slot:append>
                  <v-menu location="bottom end">
                    <template v-slot:activator="{ props }">
                      <v-btn icon variant="text" size="small" v-bind="props">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="openEditAccountDialog(account)">
                        <template v-slot:prepend>
                          <v-icon>mdi-pencil</v-icon>
                        </template>
                        <v-list-item-title>Edit</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="openDeleteAccountDialog(account)">
                        <template v-slot:prepend>
                          <v-icon>mdi-delete</v-icon>
                        </template>
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-card-item>
              <v-card-text>
                <div class="text-h5 font-weight-bold mb-2">
                  {{ formatCurrency(account.balance) }}
                </div>
                <p class="text-caption text-medium-emphasis">{{ account.type }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <EmptyState
          v-else
          icon="mdi-bank-outline"
          title="No Accounts Found"
          description="Add your bank accounts, credit cards, and cash to track your finances."
          actionText="Add Your First Account"
          actionIcon="mdi-plus"
          @action="openNewAccountDialog"
        />
      </v-col>
    </v-row>

    <!-- Recent Transactions -->
    <v-row class="mt-3">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <div><div class="eyebrow mb-1">Latest activity</div><h2 class="section-heading">Recent transactions</h2></div>
          <v-btn color="primary" variant="text" to="/transaction">
            View All
            <v-icon class="ml-1">mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <v-card>
          <v-list v-if="financeStore.recentTransactions.length > 0">
            <v-list-item
              v-for="(transaction, index) in financeStore.recentTransactions"
              :key="index"
              :ripple="false"
            >
              <template v-slot:prepend>
                <v-avatar :color="getCategoryColor(transaction.category)" size="40" variant="tonal">
                  <v-icon>{{ getCategoryIcon(transaction.category) }}</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>{{ transaction.description }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(transaction.date) }} •
                {{ financeStore.accountName(transaction.account) }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                  <span :class="transaction.type === 'expense' ? 'text-error' : 'text-success'">
                    {{
                      transaction.type === 'transfer'
                        ? '↔ '
                        : transaction.type === 'expense'
                          ? '-'
                          : '+'
                    }}{{ formatCurrency(transaction.amount) }}
                  </span>
                  <v-chip
                    size="x-small"
                    :color="getCategoryColor(transaction.category)"
                    class="mt-1"
                    variant="tonal"
                  >
                    {{
                      transaction.type === 'transfer'
                        ? 'Transfer'
                        : financeStore.categoryName(transaction.category)
                    }}
                  </v-chip>
                </div>
              </template>
            </v-list-item>
          </v-list>
          <EmptyState
            v-else
            icon="mdi-receipt-outline"
            title="No Transactions Yet"
            description="Start tracking your income and expenses by adding transactions."
            actionText="Add Your First Transaction"
            actionIcon="mdi-plus"
            @action="openNewTransactionDialog"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Transaction Dialog -->
    <v-dialog v-model="transactionDialog" max-width="600px">
      <v-card>
        <v-card-title>{{ isEditMode ? 'Edit Transaction' : 'New Transaction' }}</v-card-title>
        <TransactionForm
          :transaction="transactionData"
          :account-options="accountOptions"
          @submit="saveTransaction"
          @cancel="closeTransactionDialog"
        />
      </v-card>
    </v-dialog>

    <!-- Add/Edit Account Dialog -->
    <v-dialog v-model="accountDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ isEditMode ? 'Edit Account' : 'New Account' }}</v-card-title>
        <AccountForm :account="accountData" @submit="saveAccount" @cancel="closeAccountDialog" />
      </v-card>
    </v-dialog>

    <!-- Delete Account Dialog -->
    <v-dialog v-model="deleteAccountDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete Account</v-card-title>
        <v-card-text
          ><v-alert v-if="financeStore.error" type="error" class="mb-3">{{
            financeStore.error
          }}</v-alert>
          Are you sure you want to delete this account? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="closeDeleteAccountDialog">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deleteAccount">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </DashboardLayout>
</template>

<style scoped>
.page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
.metric-row { margin-bottom: 14px; }
.metric-card { overflow: hidden; }
.metric-card::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), .15)); }
.metric-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.metric-hint { margin-top: 8px; color: rgba(var(--v-theme-on-surface), .52); font-size: .76rem; }
@media (max-width: 599px) {
  .page-header { align-items: stretch; flex-direction: column; gap: 18px; }
  .page-header .v-btn { width: 100%; }
}
</style>
