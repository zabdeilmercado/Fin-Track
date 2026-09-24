<script setup>
import { today } from '@/utils/financeMath'
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency, formatDate, getCategoryColor } from '@/utils/formatters'
import { TRANSACTION_TYPES, TRANSACTION_HEADERS } from '@/utils/constants'
import DashboardLayout from '@/components/DashboardLayout.vue'
import EmptyState from '@/components/EmptyState.vue'
import TransactionForm from '@/components/TransactionForm.vue'

const financeStore = useFinanceStore()

// Search and filters
const search = ref('')
const filters = ref({
  account: null,
  category: null,
  type: null,
  startDate: null,
  endDate: null,
})

// Dialog state
const transactionDialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const selectedTransaction = ref(null)
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

// Loading state
const loading = computed(() => financeStore.isLoading)

// Table headers
const headers = TRANSACTION_HEADERS

// Options for dropdowns
const typeOptions = TRANSACTION_TYPES
const categoryOptions = computed(() =>
  financeStore.categories.map((c) => ({ title: c.name, value: c.id })),
)

// Computed properties
const accountOptions = computed(() => {
  return financeStore.accounts.map((account) => ({
    title: account.name,
    value: account.id,
  }))
})

const filteredTransactions = computed(() => {
  const searchValue = search.value.toLowerCase()
  const accountFilter = filters.value.account
  const categoryFilter = filters.value.category
  const typeFilter = filters.value.type
  const startDateFilter = filters.value.startDate
  const endDateFilter = filters.value.endDate

  return financeStore.transactions.filter((transaction) => {
    const searchMatch =
      searchValue === '' ||
      transaction.description.toLowerCase().includes(searchValue) ||
      (transaction.notes || '').toLowerCase().includes(searchValue)

    const accountMatch =
      !accountFilter ||
      transaction.account === accountFilter ||
      transaction.toAccount === accountFilter
    const categoryMatch = !categoryFilter || transaction.category === categoryFilter
    const typeMatch = !typeFilter || transaction.type === typeFilter

    const startDateMatch =
      !startDateFilter || new Date(transaction.date) >= new Date(startDateFilter)
    const endDateMatch = !endDateFilter || new Date(transaction.date) <= new Date(endDateFilter)

    return (
      searchMatch && accountMatch && categoryMatch && typeMatch && startDateMatch && endDateMatch
    )
  })
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
  financeStore.error = ''
  transactionDialog.value = true
}

const openEditTransactionDialog = (transaction) => {
  isEditMode.value = true
  selectedTransaction.value = transaction
  transactionData.value = { ...transaction }
  financeStore.error = ''
  transactionDialog.value = true
}

const openDeleteTransactionDialog = (transaction) => {
  selectedTransaction.value = transaction
  deleteDialog.value = true
}

const closeTransactionDialog = () => {
  transactionDialog.value = false
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
}

const deleteTransaction = async () => {
  if (await financeStore.deleteTransaction(selectedTransaction.value.id)) closeDeleteDialog()
}

const saveTransaction = async (transaction) => {
  if (isEditMode.value && selectedTransaction.value) {
    if (!(await financeStore.updateTransaction(selectedTransaction.value.id, transaction))) return
  } else {
    if (!(await financeStore.addTransaction(transaction))) return
  }
  closeTransactionDialog()
}

const resetFilters = () => {
  filters.value = {
    account: null,
    category: null,
    type: null,
    startDate: null,
    endDate: null,
  }
  search.value = ''
}

onMounted(() => {
  financeStore.init()
})
</script>

<template>
  <DashboardLayout pageTitle="Transactions" activeItem="transaction">
    <v-row>
      <v-col cols="12">
        <v-row align="center" class="mb-6">
          <v-col cols="auto">
            <h1 class="text-h4 font-weight-bold">Transactions</h1>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openNewTransactionDialog">
              Add Transaction
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-alert
      v-if="!financeStore.accounts.length && !financeStore.isLoading"
      type="info"
      class="mb-4"
      >Add your first account on the Dashboard before recording transactions.<v-btn
        to="/dashboard"
        variant="text"
        >Add account</v-btn
      ></v-alert
    >
    <!-- Transaction Filters -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Search transactions"
                  single-line
                  hide-details
                  variant="outlined"
                  density="comfortable"
                  class="mb-4 mb-md-0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="8">
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="filters.account"
                      :items="accountOptions"
                      label="Account"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      clearable
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="filters.category"
                      :items="categoryOptions"
                      label="Category"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      clearable
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="filters.type"
                      :items="typeOptions"
                      label="Type"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="filters.startDate"
                  type="date"
                  label="Start date"
                  clearable
                  hide-details
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="filters.endDate"
                  type="date"
                  label="End date"
                  clearable
                  hide-details
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6" class="d-flex justify-end align-center">
                <v-btn variant="text" color="primary" class="mr-2" @click="resetFilters">
                  Reset Filters
                </v-btn>
                <span class="text-caption">Filters apply automatically</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Transaction List -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
            v-if="filteredTransactions.length > 0"
            :headers="headers"
            :items="filteredTransactions"
            :items-per-page="10"
            :sort-by="[{ key: 'date', order: 'desc' }]"
            :loading="loading"
            class="elevation-0"
          >
            <template v-slot:[`item.date`]="{ item }">
              {{ formatDate(item.date) }}
            </template>
            <template v-slot:[`item.amount`]="{ item }">
              <span :class="item.type === 'expense' ? 'text-error' : 'text-success'">
                {{ item.type === 'transfer' ? '↔ ' : item.type === 'expense' ? '-' : '+'
                }}{{ formatCurrency(item.amount) }}
              </span>
            </template>
            <template v-slot:[`item.account`]="{ item }">
              {{ financeStore.accountName(item.account) }}
              <span v-if="item.type === 'transfer'">
                → {{ financeStore.accountName(item.toAccount) }}</span
              >
            </template>
            <template v-slot:[`item.category`]="{ item }">
              <v-chip
                :color="getCategoryColor(item.category)"
                size="small"
                variant="tonal"
                class="text-caption"
              >
                {{
                  item.type === 'transfer' ? 'Transfer' : financeStore.categoryName(item.category)
                }}
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon
                variant="text"
                size="small"
                :aria-label="`Edit ${item.description}`"
                @click="openEditTransactionDialog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                :aria-label="`Delete ${item.description}`"
                @click="openDeleteTransactionDialog(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <EmptyState
            v-else
            icon="mdi-wallet-outline"
            title="No Transactions Found"
            description="Start tracking your finances by adding your first transaction."
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

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete Transaction</v-card-title>
        <v-card-text
          ><v-alert v-if="financeStore.error" type="error" class="mb-3">{{
            financeStore.error
          }}</v-alert>
          Are you sure you want to delete this transaction? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="closeDeleteDialog">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deleteTransaction">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </DashboardLayout>
</template>
