import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { CATEGORY_OPTIONS } from '@/utils/constants'
import {
  today,
  validDate,
  validMonth,
  money,
  accountEffect,
  monthSummary,
  budgetProgress,
} from '@/utils/financeMath'
import { getCategoryColor, getCategoryIcon } from '@/utils/formatters'

const emptyState = () => ({
  budgets: [],
  goals: [],
  accounts: [],
  transactions: [],
  categories: CATEGORY_OPTIONS.map((c) => ({
    id: c.value,
    name: c.title,
    color: getCategoryColor(c.value),
    icon: getCategoryIcon(c.value),
  })),
})
const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100

export const useFinanceStore = defineStore('finance', () => {
  const state = ref(emptyState())
  const userId = ref(null)
  const version = ref(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref('')
  const selectedMonth = ref(today().slice(0, 7))
  const lastSynced = ref(null)
  let generation = 0
  const transactions = computed(() => state.value.transactions)
  const accounts = computed(() =>
    state.value.accounts.map((a) => ({
      ...a,
      balance: round(
        Number(a.balance) + transactions.value.reduce((sum, t) => sum + accountEffect(t, a), 0),
      ),
    })),
  )
  const totalBalance = computed(() =>
    round(accounts.value.reduce((sum, a) => sum + a.balance * (a.type === 'credit' ? -1 : 1), 0)),
  )
  const totalIncome = computed(() =>
    round(
      transactions.value
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0),
    ),
  )
  const totalExpenses = computed(() =>
    round(
      transactions.value
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0),
    ),
  )
  const savingsRate = computed(() =>
    totalIncome.value
      ? Math.round(((totalIncome.value - totalExpenses.value) / totalIncome.value) * 100)
      : 0,
  )
  const categories = computed(() =>
    state.value.categories.map((c) => {
      const entries = transactions.value.filter((t) => t.category === c.id)
      const amount = round(
        entries.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0),
      )
      return {
        ...c,
        count: entries.length,
        amount,
        percentage: totalExpenses.value ? Math.round((amount / totalExpenses.value) * 100) : 0,
      }
    }),
  )
  const recentTransactions = computed(() =>
    [...transactions.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
  )
  const topCategory = computed(
    () =>
      [...categories.value].filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount)[0] ||
      null,
  )
  const uncategorized = computed(() =>
    transactions.value.filter((t) => t.category === 'uncategorized'),
  )
  const uncategorizedCount = computed(() => uncategorized.value.length)
  const uncategorizedAmount = computed(() =>
    round(
      uncategorized.value.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    ),
  )
  const accountName = (id) => accounts.value.find((a) => a.id === id)?.name || 'Deleted account'
  const categoryName = (id) => categories.value.find((c) => c.id === id)?.name || 'Uncategorized'

  function reset() {
    generation += 1
    lastSynced.value = null
    state.value = emptyState()
    userId.value = null
    version.value = null
    error.value = ''
  }

  async function init(force = false) {
    if (isLoading.value || isSaving.value) return
    isLoading.value = true
    error.value = ''
    try {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { data: auth, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!auth.user) throw new Error('Please sign in again.')
      if (userId.value === auth.user.id && !force) return
      if (userId.value !== auth.user.id) reset()
      const requestGeneration = generation
      const { data, error: loadError } = await supabase
        .from('finance_state')
        .select('payload, version')
        .eq('user_id', auth.user.id)
        .maybeSingle()
      if (loadError) throw loadError
      if (requestGeneration !== generation) return
      state.value = { ...emptyState(), ...data?.payload }
      lastSynced.value = new Date().toISOString()
      version.value = data?.version ?? null
      userId.value = auth.user.id
    } catch (err) {
      error.value = err.message?.includes('finance_state')
        ? 'Your database needs setup. Run supabase/schema.sql in your Supabase SQL editor, then reload data.'
        : err.message
    } finally {
      isLoading.value = false
    }
  }

  async function change(mutate) {
    if (isSaving.value || isLoading.value) return false
    isSaving.value = true
    error.value = ''
    try {
      if (!userId.value) throw new Error('Load your data successfully before making changes.')
      const requestGeneration = generation
      const next = JSON.parse(JSON.stringify(state.value))
      mutate(next)
      const nextVersion = (version.value ?? 0) + 1
      const row = { user_id: userId.value, payload: next, version: nextVersion }
      const query =
        version.value === null
          ? supabase.from('finance_state').insert(row)
          : supabase
              .from('finance_state')
              .update({ payload: next, version: nextVersion })
              .eq('user_id', userId.value)
              .eq('version', version.value)
      const { data, error: saveError } = await query.select('version').maybeSingle()
      if (saveError) throw saveError
      if (!data)
        throw new Error('Your data changed in another session. Reload your data and try again.')
      if (requestGeneration !== generation) return false
      state.value = next
      lastSynced.value = new Date().toISOString()
      version.value = data.version
      return true
    } catch (err) {
      error.value = err.message?.includes('finance_state')
        ? 'Your database needs setup. Run supabase/schema.sql in your Supabase SQL editor, then reload data.'
        : err.message
      return false
    } finally {
      isSaving.value = false
    }
  }

  function accountRecord(a, id) {
    if (!a.name?.trim() || !['checking', 'savings', 'cash', 'credit'].includes(a.type))
      throw new Error('Enter an account name and a valid balance.')
    return { ...a, id, name: a.name.trim(), balance: money(a.balance, true, true) }
  }
  function transactionRecord(t, id, next) {
    if (!t.description?.trim() || !Number.isFinite(Number(t.amount)) || Number(t.amount) <= 0)
      throw new Error('Enter a description and a positive amount.')
    if (
      !['income', 'expense', 'transfer'].includes(t.type) ||
      !validDate(t.date) ||
      t.date > today()
    )
      throw new Error('Enter a valid date, today or earlier, and a transaction type.')
    if (!next.accounts.some((a) => a.id === t.account))
      throw new Error('Add an account on the Dashboard first.')
    if (
      t.type === 'transfer' &&
      (t.account === t.toAccount || !next.accounts.some((a) => a.id === t.toAccount))
    )
      throw new Error('Choose a different destination account.')
    if (t.type !== 'transfer' && !next.categories.some((c) => c.id === t.category))
      throw new Error('Select an existing category.')
    return {
      ...t,
      id,
      description: t.description.trim(),
      amount: money(t.amount),
      category: t.type === 'transfer' ? '' : t.category,
      toAccount: t.type === 'transfer' ? t.toAccount : '',
      notes: t.notes || '',
    }
  }
  const addAccount = (a) => change((s) => s.accounts.push(accountRecord(a, crypto.randomUUID())))
  const updateAccount = (id, a) =>
    change((s) => {
      const existing = s.accounts.find((x) => x.id === id)
      if (!existing) throw new Error('Account no longer exists.')
      money(a.balance, true, true)
      if (a.type !== 'savings' && s.goals.some((g) => g.account === id))
        throw new Error('Remove this account’s savings goal before changing its type.')
      const adjustment = s.transactions.reduce((sum, t) => sum + accountEffect(t, { ...a, id }), 0)
      Object.assign(existing, accountRecord({ ...a, balance: Number(a.balance) - adjustment }, id))
    })
  const deleteAccount = (id) =>
    change((s) => {
      if (s.transactions.some((t) => t.account === id || t.toAccount === id))
        throw new Error('Move or delete this account’s transactions before deleting it.')
      if (s.goals.some((g) => g.account === id))
        throw new Error('Remove this account’s savings goal first.')
      s.accounts = s.accounts.filter((a) => a.id !== id)
    })
  const addTransaction = (t) =>
    change((s) => s.transactions.push(transactionRecord(t, crypto.randomUUID(), s)))
  const updateTransaction = (id, t) =>
    change((s) => {
      s.transactions = s.transactions.map((x) => (x.id === id ? transactionRecord(t, id, s) : x))
    })
  const deleteTransaction = (id) =>
    change((s) => {
      s.transactions = s.transactions.filter((t) => t.id !== id)
    })
  const addCategory = (c) =>
    change((s) => {
      if (!c.name?.trim()) throw new Error('Category name is required.')
      s.categories.push({ ...c, name: c.name.trim(), id: crypto.randomUUID() })
    })
  const updateCategory = (id, c) =>
    change((s) => {
      if (!c.name?.trim()) throw new Error('Category name is required.')
      s.categories = s.categories.map((x) => (x.id === id ? { ...c, id, name: c.name.trim() } : x))
    })
  const deleteCategory = (id) =>
    change((s) => {
      if (s.transactions.some((t) => t.category === id))
        throw new Error('Reassign this category’s transactions before deleting it.')
      if (s.budgets.some((b) => b.category === id))
        throw new Error('Remove budgets for this category first.')
      s.categories = s.categories.filter((c) => c.id !== id)
    })
  const monthly = computed(() => monthSummary(transactions.value, selectedMonth.value))
  const budgets = computed(() => state.value.budgets)
  const monthBudgets = computed(() =>
    budgets.value
      .filter((b) => b.month === selectedMonth.value)
      .map((b) => {
        const spent = round(
          transactions.value
            .filter(
              (t) =>
                t.type === 'expense' &&
                t.date.startsWith(b.month) &&
                (!b.category || t.category === b.category),
            )
            .reduce((sum, t) => sum + t.amount, 0),
        )
        return {
          ...b,
          ...budgetProgress(b.amount, spent),
          name: b.category ? categoryName(b.category) : 'Overall monthly budget',
        }
      }),
  )
  const overallBudget = computed(() => monthBudgets.value.find((b) => !b.category) || null)
  const savingsBalance = computed(() =>
    round(
      accounts.value.filter((a) => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0),
    ),
  )
  const goals = computed(() =>
    state.value.goals.map((g) => {
      const saved = Math.max(0, accounts.value.find((a) => a.id === g.account)?.balance || 0)
      return {
        ...g,
        saved,
        remaining: Math.max(0, round(g.target - saved)),
        percent: Math.round((saved / g.target) * 100),
        completed: saved >= g.target,
        overdue: !!g.deadline && g.deadline < today() && saved < g.target,
      }
    }),
  )
  const saveBudget = (b) =>
    change((s) => {
      if (!validMonth(b.month)) throw new Error('Choose a valid month.')
      if (b.category && !s.categories.some((c) => c.id === b.category))
        throw new Error('Choose an existing category.')
      const existing = s.budgets.find(
        (x) => x.month === b.month && (x.category || '') === (b.category || ''),
      )
      const record = {
        id: existing?.id || crypto.randomUUID(),
        month: b.month,
        category: b.category || '',
        amount: money(b.amount),
      }
      if (existing) Object.assign(existing, record)
      else s.budgets.push(record)
    })
  const deleteBudget = (id) =>
    change((s) => {
      s.budgets = s.budgets.filter((b) => b.id !== id)
    })
  const saveGoal = (g) =>
    change((s) => {
      if (!g.name?.trim()) throw new Error('Give your goal a name.')
      if (!s.accounts.some((a) => a.id === g.account && a.type === 'savings'))
        throw new Error('Choose a savings account for this goal.')
      if (s.goals.some((x) => x.account === g.account && x.id !== g.id))
        throw new Error(
          'This account already has a goal. Use a separate savings account to avoid counting the same money twice.',
        )
      if (g.deadline && !validDate(g.deadline)) throw new Error('Enter a valid target date.')
      const record = {
        id: g.id || crypto.randomUUID(),
        name: g.name.trim(),
        account: g.account,
        target: money(g.target),
        deadline: g.deadline || '',
      }
      const existing = s.goals.find((x) => x.id === g.id)
      if (existing) Object.assign(existing, record)
      else s.goals.push(record)
    })
  const deleteGoal = (id) =>
    change((s) => {
      s.goals = s.goals.filter((g) => g.id !== id)
    })
  const exportData = () =>
    JSON.stringify(
      {
        app: 'FinTrack',
        version: 1,
        currency: 'PHP',
        exportedAt: new Date().toISOString(),
        data: state.value,
      },
      null,
      2,
    )
  return {
    selectedMonth,
    monthly,
    budgets,
    monthBudgets,
    overallBudget,
    goals,
    savingsBalance,
    lastSynced,
    saveBudget,
    deleteBudget,
    saveGoal,
    deleteGoal,
    exportData,
    accounts,
    transactions,
    categories,
    isLoading,
    isSaving,
    error,
    totalBalance,
    totalIncome,
    totalExpenses,
    savingsRate,
    recentTransactions,
    topCategory,
    uncategorizedAmount,
    uncategorizedCount,
    accountName,
    categoryName,
    init,
    reset,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
  }
})
