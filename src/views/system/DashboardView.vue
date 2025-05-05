<script setup>
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
import AccountForm from '@/components/AccountForm.vue'
// Import chart components
import { Line, Pie } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const financeStore = useFinanceStore()

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
  date: new Date().toISOString().substr(0, 10),
  category: '',
  notes: '',
  account: '', // Add account field to transaction data
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

// Chart data
const incomeVsExpensesData = computed(() => {
  // Get last 6 months of data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  
  // This would normally come from your store with actual monthly data
  const incomeData = [1200, 1500, 1300, 1700, 1600, 1800]
  const expenseData = [900, 1100, 950, 1300, 1200, 1400]
  
  return {
    labels: months,
    datasets: [
      {
        label: 'Income',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        data: incomeData,
        tension: 0.4
      },
      {
        label: 'Expenses',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        data: expenseData,
        tension: 0.4
      }
    ]
  }
})

const expenseBreakdownData = computed(() => {
  // This would normally be calculated from your actual transaction data
  return {
    labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
    datasets: [
      {
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'
        ],
        data: [30, 20, 15, 10, 15, 10]
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

// Transaction methods
const openNewTransactionDialog = () => {
  isEditMode.value = false
  transactionData.value = {
    id: null,
    description: '',
    amount: 0,
    type: 'expense',
    date: new Date().toISOString().substr(0, 10),
    category: '',
    notes: '',
    account: financeStore.accounts.length > 0 ? financeStore.accounts[0].id : '', // Default to first account if available
  }
  transactionDialog.value = true
}

const openEditTransactionDialog = (transaction) => {
  isEditMode.value = true
  selectedTransaction.value = transaction
  transactionData.value = { ...transaction }
  transactionDialog.value = true
}

const closeTransactionDialog = () => {
  transactionDialog.value = false
}

const saveTransaction = (transaction) => {
  // Ensure the transaction has an account associated with it
  if (!transaction.account && financeStore.accounts.length > 0) {
    transaction.account = financeStore.accounts[0].id
  }
  
  if (isEditMode.value && selectedTransaction.value) {
    financeStore.updateTransaction(selectedTransaction.value.id, transaction)
  } else {
    financeStore.addTransaction(transaction)
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
  accountDialog.value = true
}

const openEditAccountDialog = (account) => {
  isEditMode.value = true
  selectedAccount.value = account
  accountData.value = { ...account }
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

const deleteAccount = () => {
  financeStore.deleteAccount(selectedAccount.value.id)
  closeDeleteAccountDialog()
}

const saveAccount = (account) => {
  if (isEditMode.value && selectedAccount.value) {
    financeStore.updateAccount(selectedAccount.value.id, account)
  } else {
    // Generate a unique ID for the new account if not provided
    if (!account.id) {
      account.id = 'acc_' + Date.now()
    }
    financeStore.addAccount(account)
  }
  closeAccountDialog()
}

onMounted(() => {
  financeStore.init()
})
</script>

<template>
  <DashboardLayout pageTitle="Dashboard" activeItem="dashboard">
    <!-- Welcome Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-text class="d-flex flex-column flex-sm-row align-center">
            <div>
              <h2 class="text-h4 font-weight-bold mb-2">Welcome back!</h2>
              <p class="text-body-1 text-medium-emphasis">Here's an overview of your finances.</p>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              class="mt-4 mt-sm-0"
              @click="openNewTransactionDialog"
            >
              Add Transaction
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Financial Overview Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="h-100">
          <v-card-text>
            <div class="d-flex flex-column">
              <div class="text-overline text-medium-emphasis">Total Balance</div>
              <div class="text-h4 font-weight-bold">
                {{ formatCurrency(financeStore.totalBalance) }}
              </div>
              <div class="d-flex align-center mt-2">
                <v-icon
                  :color="financeStore.balanceChange >= 0 ? 'success' : 'error'"
                  size="small"
                  class="mr-1"
                >
                  {{ financeStore.balanceChange >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
                <span
                  :class="financeStore.balanceChange >= 0 ? 'text-success' : 'text-error'"
                  class="text-caption"
                >
                  {{ Math.abs(financeStore.balanceChange) }}% from last month
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="h-100">
          <v-card-text>
            <div class="d-flex flex-column">
              <div class="text-overline text-medium-emphasis">Income</div>
              <div class="text-h4 font-weight-bold text-success">
                {{ formatCurrency(financeStore.totalIncome) }}
              </div>
              <div class="d-flex align-center mt-2">
                <v-icon
                  :color="financeStore.incomeChange >= 0 ? 'success' : 'error'"
                  size="small"
                  class="mr-1"
                >
                  {{ financeStore.incomeChange >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
                <span
                  :class="financeStore.incomeChange >= 0 ? 'text-success' : 'text-error'"
                  class="text-caption"
                >
                  {{ Math.abs(financeStore.incomeChange) }}% from last month
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="h-100">
          <v-card-text>
            <div class="d-flex flex-column">
              <div class="text-overline text-medium-emphasis">Expenses</div>
              <div class="text-h4 font-weight-bold text-error">
                {{ formatCurrency(financeStore.totalExpenses) }}
              </div>
              <div class="d-flex align-center mt-2">
                <v-icon
                  :color="financeStore.expenseChange <= 0 ? 'success' : 'error'"
                  size="small"
                  class="mr-1"
                >
                  {{ financeStore.expenseChange <= 0 ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
                </v-icon>
                <span
                  :class="financeStore.expenseChange <= 0 ? 'text-success' : 'text-error'"
                  class="text-caption"
                >
                  {{ Math.abs(financeStore.expenseChange) }}% from last month
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="h-100">
          <v-card-text>
            <div class="d-flex flex-column">
              <div class="text-overline text-medium-emphasis">Savings Rate</div>
              <div class="text-h4 font-weight-bold">{{ financeStore.savingsRate }}%</div>
              <div class="d-flex align-center mt-2">
                <v-icon
                  :color="financeStore.savingsChange >= 0 ? 'success' : 'error'"
                  size="small"
                  class="mr-1"
                >
                  {{ financeStore.savingsChange >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
                <span
                  :class="financeStore.savingsChange >= 0 ? 'text-success' : 'text-error'"
                  class="text-caption"
                >
                  {{ Math.abs(financeStore.savingsChange) }}% from last month
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Income vs Expenses</v-card-title>
          <v-card-text style="height: 300px">
            <v-sheet class="d-flex justify-center align-center" height="100%">
              <template v-if="hasTransactionData">
                <!-- Actual chart implementation -->
                <Line 
                  :data="incomeVsExpensesData" 
                  :options="chartOptions"
                  style="width: 100%; height: 100%;"
                />
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
        <v-card>
          <v-card-title>Expense Breakdown</v-card-title>
          <v-card-text style="height: 300px">
            <v-sheet class="d-flex justify-center align-center" height="100%">
              <template v-if="hasTransactionData">
                <!-- Actual pie chart implementation -->
                <Pie 
                  :data="expenseBreakdownData" 
                  :options="chartOptions"
                  style="width: 100%; height: 100%;"
                />
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
    <v-row class="mt-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="text-h5 font-weight-bold">Your Accounts</h2>
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
            <v-card class="h-100">
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
    <v-row class="mt-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="text-h5 font-weight-bold">Recent Transactions</h2>
          <v-btn color="primary" variant="text" to="/transactions">
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
              @click="openEditTransactionDialog(transaction)"
            >
              <template v-slot:prepend>
                <v-avatar :color="getCategoryColor(transaction.category)" size="40" variant="tonal">
                  <v-icon>{{ getCategoryIcon(transaction.category) }}</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>{{ transaction.description }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(transaction.date) }} • 
                {{ financeStore.getAccountNameById(transaction.account) }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                  <span :class="transaction.type === 'expense' ? 'text-error' : 'text-success'">
                    {{ transaction.type === 'expense' ? '-' : '+'
                    }}{{ formatCurrency(transaction.amount) }}
                  </span>
                  <v-chip
                    size="x-small"
                    :color="getCategoryColor(transaction.category)"
                    class="mt-1"
                    variant="tonal"
                  >
                    {{ transaction.category }}
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
        <v-card-text>
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