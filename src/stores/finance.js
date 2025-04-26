import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  // Collections
  const accounts = ref([])
  const transactions = ref([])
  const categories = ref([])

  // Financial summary
  const totalBalance = computed(() => {
    return accounts.value.reduce((sum, account) => {
      return sum + (account.type === 'credit' ? -account.balance : account.balance)
    }, 0)
  })

  const totalIncome = computed(() => {
    return transactions.value
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const totalExpenses = computed(() => {
    return transactions.value
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const savingsRate = computed(() => {
    return totalIncome.value > 0
      ? Math.round(((totalIncome.value - totalExpenses.value) / totalIncome.value) * 100)
      : 0
  })

  // Recent transactions
  const recentTransactions = computed(() => {
    return [...transactions.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  })

  // Top category
  const topCategory = computed(() => {
    if (categories.value.length === 0) return null

    return (
      [...categories.value]
        .filter((cat) => cat.amount > 0)
        .sort((a, b) => b.percentage - a.percentage)[0] || null
    )
  })

  // Uncategorized stats
  const uncategorizedAmount = ref(0)
  const uncategorizedCount = ref(0)

  // Change percentages - would be calculated from actual data
  const balanceChange = ref(0)
  const incomeChange = ref(0)
  const expenseChange = ref(0)
  const savingsChange = ref(0)

  // Initialize store with data
  const init = () => {
    // This would typically load data from an API or local storage
    // For now, we'll just initialize with empty arrays
    accounts.value = []
    transactions.value = []
    categories.value = []
  }

  // CRUD operations for accounts
  const addAccount = (account) => {
    accounts.value.push({
      id: Date.now(),
      ...account,
    })
  }

  const updateAccount = (id, updatedAccount) => {
    const index = accounts.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...updatedAccount }
    }
  }

  const deleteAccount = (id) => {
    const index = accounts.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
    }
  }

  // CRUD operations for transactions
  const addTransaction = (transaction) => {
    transactions.value.push({
      id: Date.now(),
      ...transaction,
    })
  }

  const updateTransaction = (id, updatedTransaction) => {
    const index = transactions.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      transactions.value[index] = { ...transactions.value[index], ...updatedTransaction }
    }
  }

  const deleteTransaction = (id) => {
    const index = transactions.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      transactions.value.splice(index, 1)
    }
  }

  // CRUD operations for categories
  const addCategory = (category) => {
    categories.value.push({
      id: Date.now(),
      ...category,
    })
  }

  const updateCategory = (id, updatedCategory) => {
    const index = categories.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updatedCategory }
    }
  }

  const deleteCategory = (id) => {
    const index = categories.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
  }

  return {
    // Data
    accounts,
    transactions,
    categories,

    // Computed values
    totalBalance,
    totalIncome,
    totalExpenses,
    savingsRate,
    recentTransactions,
    topCategory,
    uncategorizedAmount,
    uncategorizedCount,

    // Change metrics
    balanceChange,
    incomeChange,
    expenseChange,
    savingsChange,

    // Initialization
    init,

    // Account operations
    addAccount,
    updateAccount,
    deleteAccount,

    // Transaction operations
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // Category operations
    addCategory,
    updateCategory,
    deleteCategory,
  }
})
