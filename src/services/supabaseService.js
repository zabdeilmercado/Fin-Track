import { supabase } from '@/utils/supabase'
export { supabase }

// Income API
export const incomeService = {
  // Get all income entries for the current user
  getIncomes: async () => {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .order('date_received', { ascending: false })

    if (error) throw error
    return data
  },

  // Get a single income entry by ID
  getIncome: async (id) => {
    const { data, error } = await supabase.from('incomes').select('*').eq('id', id).single()

    if (error) throw error
    return data
  },

  // Create a new income entry
  createIncome: async (income) => {
    // Add user_id if not provided
    const newIncome = {
      ...income,
      user_id: income.user_id || (await supabase.auth.getUser()).data.user?.id,
    }

    const { data, error } = await supabase.from('incomes').insert([newIncome]).select()

    if (error) throw error
    return data[0]
  },

  // Update an existing income entry
  updateIncome: async (id, income) => {
    const { data, error } = await supabase.from('incomes').update(income).eq('id', id).select()

    if (error) throw error
    return data[0]
  },

  // Delete an income entry
  deleteIncome: async (id) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id)

    if (error) throw error
    return true
  },

  // Get income entries for a specific date range
  getIncomesByDateRange: async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .gte('date_received', startDate)
      .lte('date_received', endDate)
      .order('date_received', { ascending: false })

    if (error) throw error
    return data
  },

  // Subscribe to income changes
  subscribeToIncomes: (callback) => {
    return supabase
      .channel('incomes-changes') // Changed from 'income-changes' to 'incomes-changes'
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incomes' }, (payload) => {
        callback(payload)
      })
      .subscribe()
  },
}

// The rest of the code remains the same
export const transactionsService = {
  // Get all transactions for the current user
  getTransactions: async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(
        `
        *,
        categories (*)
      `,
      )
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get a single transaction by ID
  getTransaction: async (id) => {
    const { data, error } = await supabase
      .from('transactions')
      .select(
        `
        *,
        categories (*)
      `,
      )
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create a new transaction
  createTransaction: async (transaction) => {
    // Add user_id if not provided
    const newTransaction = {
      ...transaction,
      user_id: transaction.user_id || (await supabase.auth.getUser()).data.user?.id,
    }

    const { data, error } = await supabase.from('transactions').insert([newTransaction]).select()

    if (error) throw error
    return data[0]
  },

  // Update an existing transaction
  updateTransaction: async (id, transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete a transaction
  deleteTransaction: async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)

    if (error) throw error
    return true
  },

  // Get transactions by category
  getTransactionsByCategory: async (categoryId) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get transactions for a specific date range
  getTransactionsByDateRange: async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('transactions')
      .select(
        `
        *,
        categories (*)
      `,
      )
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Subscribe to transaction changes
  subscribeToTransactions: (callback) => {
    return supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          callback(payload)
        },
      )
      .subscribe()
  },
}

// Categories API
export const categoriesService = {
  // Get all categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get a single category by ID
  getCategory: async (id) => {
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()

    if (error) throw error
    return data
  },

  // Create a new category
  createCategory: async (category) => {
    const { data, error } = await supabase.from('categories').insert([category]).select()

    if (error) throw error
    return data[0]
  },

  // Update an existing category
  updateCategory: async (id, category) => {
    const { data, error } = await supabase.from('categories').update(category).eq('id', id).select()

    if (error) throw error
    return data[0]
  },

  // Delete a category
  deleteCategory: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) throw error
    return true
  },

  // Subscribe to category changes
  subscribeToCategories: (callback) => {
    return supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, (payload) => {
        callback(payload)
      })
      .subscribe()
  },
}

// User API
export const userService = {
  // Get current user
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Sign up with email and password
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  },
}
