import { ref } from 'vue'

// Generate a unique ID
const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// Mock user data
const currentUser = {
  id: 'mock-user-id-123',
  email: 'user@example.com',
  name: 'Demo User',
}

// Mock categories data
const categoriesData = ref([
  {
    id: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    category_type: 'expense',
    description: 'Food & Dining',
    icon: 'mdi-food',
    color: 'green',
  },
  {
    id: 2,
    created_at: '2023-01-01T00:00:00.000Z',
    category_type: 'expense',
    description: 'Transportation',
    icon: 'mdi-car',
    color: 'blue',
  },
  {
    id: 3,
    created_at: '2023-01-01T00:00:00.000Z',
    category_type: 'expense',
    description: 'Housing',
    icon: 'mdi-home',
    color: 'brown',
  },
  {
    id: 4,
    created_at: '2023-01-01T00:00:00.000Z',
    category_type: 'expense',
    description: 'Entertainment',
    icon: 'mdi-movie',
    color: 'purple',
  },
  {
    id: 5,
    created_at: '2023-01-01T00:00:00.000Z',
    category_type: 'expense',
    description: 'Healthcare',
    icon: 'mdi-medical-bag',
    color: 'red',
  },
  {
    id: 6,
    created_at: '2023-01-01T00:00:00.000Z',
    category_type: 'expense',
    description: 'Shopping',
    icon: 'mdi-cart',
    color: 'pink',
  },
  {
    id: 7,
    created_at: '2023-01-01T00:00:00.000Z',
    category_type: 'expense',
    description: 'Personal Care',
    icon: 'mdi-face',
    color: 'teal',
  },
  {
    id: 8,
    created_at: '2023-01-01T00:00:00.000Z',
    category_type: 'expense',
    description: 'Education',
    icon: 'mdi-school',
    color: 'indigo',
  },
  {
    id: 9,
    created_at: '2023-01-01T00:00:00.000Z',
    category_type: 'transfer',
    description: 'Transfer',
    icon: 'mdi-bank-transfer',
    color: 'grey',
  },
])

// Mock transactions data
const transactionsData = ref([
  {
    id: 101,
    created_at: '2023-05-01T12:00:00.000Z',
    transaction_type: 'expense',
    category_id: 1,
    user_id: currentUser.id,
    amount: 45.75,
    notes: 'Grocery shopping',
  },
  {
    id: 102,
    created_at: '2023-05-02T14:30:00.000Z',
    transaction_type: 'expense',
    category_id: 2,
    user_id: currentUser.id,
    amount: 35.0,
    notes: 'Gas',
  },
  {
    id: 103,
    created_at: '2023-05-03T09:15:00.000Z',
    transaction_type: 'expense',
    category_id: 4,
    user_id: currentUser.id,
    amount: 25.5,
    notes: 'Movie tickets',
  },
  {
    id: 104,
    created_at: '2023-05-04T18:45:00.000Z',
    transaction_type: 'expense',
    category_id: 1,
    user_id: currentUser.id,
    amount: 65.2,
    notes: 'Dinner at restaurant',
  },
  {
    id: 105,
    created_at: '2023-05-05T11:30:00.000Z',
    transaction_type: 'expense',
    category_id: 6,
    user_id: currentUser.id,
    amount: 120.0,
    notes: 'New clothes',
  },
  {
    id: 106,
    created_at: '2023-05-06T16:20:00.000Z',
    transaction_type: 'expense',
    category_id: 3,
    user_id: currentUser.id,
    amount: 1200.0,
    notes: 'Rent payment',
  },
  {
    id: 107,
    created_at: '2023-05-07T10:00:00.000Z',
    transaction_type: 'expense',
    category_id: 5,
    user_id: currentUser.id,
    amount: 75.0,
    notes: 'Doctor visit',
  },
  {
    id: 108,
    created_at: '2023-05-08T13:45:00.000Z',
    transaction_type: 'expense',
    category_id: 8,
    user_id: currentUser.id,
    amount: 250.0,
    notes: 'Online course',
  },
  {
    id: 109,
    created_at: '2023-05-09T15:30:00.000Z',
    transaction_type: 'expense',
    category_id: 7,
    user_id: currentUser.id,
    amount: 45.0,
    notes: 'Haircut',
  },
  {
    id: 110,
    created_at: '2023-05-10T09:00:00.000Z',
    transaction_type: 'transfer',
    category_id: 9,
    user_id: currentUser.id,
    amount: 500.0,
    notes: 'Transfer to savings',
  },
])

// Mock incomes data
const incomesData = ref([
  {
    id: 201,
    income_source: 'Salary',
    date_received: '2023-05-01T00:00:00.000Z',
    amount: 3500.0,
    user_id: currentUser.id,
    created_at: '2023-05-01T00:00:00.000Z',
    notes: 'Monthly salary',
  },
  {
    id: 202,
    income_source: 'Freelance Work',
    date_received: '2023-05-10T00:00:00.000Z',
    amount: 750.0,
    user_id: currentUser.id,
    created_at: '2023-05-10T00:00:00.000Z',
    notes: 'Website design project',
  },
  {
    id: 203,
    income_source: 'Interest',
    date_received: '2023-05-15T00:00:00.000Z',
    amount: 25.5,
    user_id: currentUser.id,
    created_at: '2023-05-15T00:00:00.000Z',
    notes: 'Savings account interest',
  },
  {
    id: 204,
    income_source: 'Side Gig',
    date_received: '2023-05-20T00:00:00.000Z',
    amount: 350.0,
    user_id: currentUser.id,
    created_at: '2023-05-20T00:00:00.000Z',
    notes: 'Tutoring',
  },
])

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock Income API
const incomeService = {
  getIncomes: async () => {
    await delay()
    return [...incomesData.value].sort(
      (a, b) => new Date(b.date_received) - new Date(a.date_received),
    )
  },

  getIncome: async (id) => {
    await delay()
    const income = incomesData.value.find((i) => i.id === id)
    if (!income) throw new Error(`Income with ID ${id} not found`)
    return income
  },

  createIncome: async (income) => {
    await delay()
    const newIncome = {
      ...income,
      id: generateId(),
      user_id: currentUser.id,
      created_at: new Date().toISOString(),
    }
    incomesData.value.unshift(newIncome)
    return newIncome
  },

  updateIncome: async (id, income) => {
    await delay()
    const index = incomesData.value.findIndex((i) => i.id === id)
    if (index === -1) throw new Error(`Income with ID ${id} not found`)

    const updatedIncome = {
      ...incomesData.value[index],
      ...income,
      id: id, // Ensure ID doesn't change
    }

    incomesData.value[index] = updatedIncome
    return updatedIncome
  },

  deleteIncome: async (id) => {
    await delay()
    const index = incomesData.value.findIndex((i) => i.id === id)
    if (index === -1) throw new Error(`Income with ID ${id} not found`)

    incomesData.value.splice(index, 1)
    return true
  },

  getIncomesByDateRange: async (startDate, endDate) => {
    await delay()
    return incomesData.value
      .filter((income) => {
        const date = new Date(income.date_received)
        return date >= new Date(startDate) && date <= new Date(endDate)
      })
      .sort((a, b) => new Date(b.date_received) - new Date(a.date_received))
  },
}

// Mock Transactions API
const transactionsService = {
  getTransactions: async () => {
    await delay()
    // Enrich transactions with category data
    return [...transactionsData.value]
      .map((transaction) => {
        const category = categoriesData.value.find((c) => c.id === transaction.category_id)
        return {
          ...transaction,
          categories: category,
        }
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getTransaction: async (id) => {
    await delay()
    const transaction = transactionsData.value.find((t) => t.id === id)
    if (!transaction) throw new Error(`Transaction with ID ${id} not found`)

    const category = categoriesData.value.find((c) => c.id === transaction.category_id)
    return {
      ...transaction,
      categories: category,
    }
  },

  createTransaction: async (transaction) => {
    await delay()
    const newTransaction = {
      ...transaction,
      id: generateId(),
      user_id: currentUser.id,
      created_at: transaction.created_at || new Date().toISOString(),
    }
    transactionsData.value.unshift(newTransaction)

    // Return with category data
    const category = categoriesData.value.find((c) => c.id === newTransaction.category_id)
    return {
      ...newTransaction,
      categories: category,
    }
  },

  updateTransaction: async (id, transaction) => {
    await delay()
    const index = transactionsData.value.findIndex((t) => t.id === id)
    if (index === -1) throw new Error(`Transaction with ID ${id} not found`)

    const updatedTransaction = {
      ...transactionsData.value[index],
      ...transaction,
      id: id, // Ensure ID doesn't change
    }

    transactionsData.value[index] = updatedTransaction

    // Return with category data
    const category = categoriesData.value.find((c) => c.id === updatedTransaction.category_id)
    return {
      ...updatedTransaction,
      categories: category,
    }
  },

  deleteTransaction: async (id) => {
    await delay()
    const index = transactionsData.value.findIndex((t) => t.id === id)
    if (index === -1) throw new Error(`Transaction with ID ${id} not found`)

    transactionsData.value.splice(index, 1)
    return true
  },

  getTransactionsByCategory: async (categoryId) => {
    await delay()
    return transactionsData.value
      .filter((t) => t.category_id === categoryId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getTransactionsByDateRange: async (startDate, endDate) => {
    await delay()
    const filteredTransactions = transactionsData.value.filter((transaction) => {
      const date = new Date(transaction.created_at)
      return date >= new Date(startDate) && date <= new Date(endDate)
    })

    // Enrich with category data
    return filteredTransactions
      .map((transaction) => {
        const category = categoriesData.value.find((c) => c.id === transaction.category_id)
        return {
          ...transaction,
          categories: category,
        }
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },
}

// Mock Categories API
const categoriesService = {
  getCategories: async () => {
    await delay()
    return [...categoriesData.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getCategory: async (id) => {
    await delay()
    const category = categoriesData.value.find((c) => c.id === id)
    if (!category) throw new Error(`Category with ID ${id} not found`)
    return category
  },

  createCategory: async (category) => {
    await delay()
    const newCategory = {
      ...category,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    categoriesData.value.unshift(newCategory)
    return newCategory
  },

  updateCategory: async (id, category) => {
    await delay()
    const index = categoriesData.value.findIndex((c) => c.id === id)
    if (index === -1) throw new Error(`Category with ID ${id} not found`)

    const updatedCategory = {
      ...categoriesData.value[index],
      ...category,
      id: id, // Ensure ID doesn't change
    }

    categoriesData.value[index] = updatedCategory
    return updatedCategory
  },

  deleteCategory: async (id) => {
    await delay()
    // Check if category is in use
    const inUse = transactionsData.value.some((t) => t.category_id === id)
    if (inUse) throw new Error(`Cannot delete category with ID ${id} because it is in use`)

    const index = categoriesData.value.findIndex((c) => c.id === id)
    if (index === -1) throw new Error(`Category with ID ${id} not found`)

    categoriesData.value.splice(index, 1)
    return true
  },
}

// Mock User API
const userService = {
  getCurrentUser: async () => {
    await delay()
    return currentUser
  },

  signIn: async (email, password) => {
    await delay()
    // Simple mock authentication
    if (email === 'user@example.com' && password === 'password') {
      return { user: currentUser, session: { access_token: 'mock-token' } }
    }
    throw new Error('Invalid email or password')
  },

  signUp: async (email) => {
    await delay()
    // Always succeed in mock mode
    return { user: { ...currentUser, email }, session: { access_token: 'mock-token' } }
  },

  signOut: async () => {
    await delay()
    return true
  },
}

// Calculate statistics for dashboard
const getStatistics = async () => {
  await delay()

  const transactions = await transactionsService.getTransactions()
  const incomes = await incomeService.getIncomes()
  const categories = await categoriesService.getCategories()

  // Total income
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)

  // Total expenses
  const totalExpenses = transactions
    .filter((t) => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Net balance
  const netBalance = totalIncome - totalExpenses

  // Savings rate
  const savingsRate =
    totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0

  // Spending by category
  const spendingByCategory = categories
    .map((category) => {
      const categoryTransactions = transactions.filter(
        (t) => t.category_id === category.id && t.transaction_type === 'expense',
      )
      const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)

      return {
        category,
        totalAmount,
        percentage: totalExpenses > 0 ? (totalAmount / totalExpenses) * 100 : 0,
      }
    })
    .filter((item) => item.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)

  // Recent transactions
  const recentTransactions = transactions.slice(0, 5)

  // Monthly income vs expenses
  const currentDate = new Date()
  const monthlyData = []

  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

    const monthlyIncome = incomes
      .filter((income) => {
        const date = new Date(income.date_received)
        return date >= month && date <= monthEnd
      })
      .reduce((sum, income) => sum + income.amount, 0)

    const monthlyExpense = transactions
      .filter((t) => {
        const date = new Date(t.created_at)
        return date >= month && date <= monthEnd && t.transaction_type === 'expense'
      })
      .reduce((sum, t) => sum + t.amount, 0)

    monthlyData.push({
      month: month.toLocaleString('default', { month: 'short' }),
      income: monthlyIncome,
      expense: monthlyExpense,
    })
  }

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    savingsRate,
    spendingByCategory,
    recentTransactions,
    monthlyData,
  }
}

// Export the mock data service
export const mockDataService = {
  // Income methods
  getIncomes: incomeService.getIncomes,
  getIncome: incomeService.getIncome,
  addIncome: incomeService.createIncome,
  updateIncome: incomeService.updateIncome,
  deleteIncome: incomeService.deleteIncome,
  getIncomesByDateRange: incomeService.getIncomesByDateRange,

  // Transaction methods
  getTransactions: transactionsService.getTransactions,
  getTransaction: transactionsService.getTransaction,
  addTransaction: transactionsService.createTransaction,
  updateTransaction: transactionsService.updateTransaction,
  deleteTransaction: transactionsService.deleteTransaction,
  getTransactionsByCategory: transactionsService.getTransactionsByCategory,
  getTransactionsByDateRange: transactionsService.getTransactionsByDateRange,

  // Category methods
  getCategories: categoriesService.getCategories,
  getCategory: categoriesService.getCategory,
  addCategory: categoriesService.createCategory,
  updateCategory: categoriesService.updateCategory,
  deleteCategory: categoriesService.deleteCategory,

  // User methods
  getCurrentUser: userService.getCurrentUser,
  signIn: userService.signIn,
  signUp: userService.signUp,
  signOut: userService.signOut,

  // Statistics
  getStatistics,
}
