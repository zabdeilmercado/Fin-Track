import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'

// Exercise the actual Pinia store against a deterministic database boundary.
test('financial persistence, balances, failures, and concurrent edits', async () => {
  const server = await createServer({
    mode: 'test',
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://test.supabase.co'),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(
        'sb_publishable_test_only_1234567890',
      ),
    },
    server: { middlewareMode: true },
  })
  try {
    const { createPinia } = await server.ssrLoadModule('pinia')
    const { supabase } = await server.ssrLoadModule('/src/utils/supabase.js')
    assert.ok(supabase, 'Set .env from .env.example for local tests (no network calls are made)')
    let row = null
    let fail = false
    supabase.auth.getUser = async () => ({ data: { user: { id: 'test-user' } }, error: null })
    supabase.from = () => {
      let operation = 'read',
        values,
        expectedVersion
      const query = {
        select() {
          return query
        },
        eq(key, value) {
          if (key === 'version') expectedVersion = value
          return query
        },
        insert(value) {
          operation = 'insert'
          values = value
          return query
        },
        update(value) {
          operation = 'update'
          values = value
          return query
        },
        async maybeSingle() {
          if (fail) return { data: null, error: new Error('Database unavailable') }
          if (operation === 'read') return { data: row && structuredClone(row), error: null }
          if (operation === 'update' && row.version !== expectedVersion)
            return { data: null, error: null }
          row = structuredClone({ ...row, ...values })
          return { data: { version: row.version }, error: null }
        },
      }
      return query
    }
    const { useFinanceStore } = await server.ssrLoadModule('/src/stores/finance.js')

    const store = useFinanceStore(createPinia())
    await store.init()
    assert.equal(
      await store.addAccount({ id: null, name: 'Cash', type: 'cash', balance: 100 }),
      true,
    )
    const id = store.accounts[0].id
    assert.ok(id)
    assert.equal(
      await store.addAccount({ name: 'x'.repeat(81), type: 'cash', balance: 0 }),
      false,
      'stored text is length-limited',
    )
    assert.equal(
      await store.addCategory({ name: 'Unsafe', icon: 'mdi-script-text', color: 'not-a-color' }),
      false,
      'category display values are allow-listed',
    )
    const expense = {
      id: null,
      description: 'Lunch',
      amount: 20,
      type: 'expense',
      account: id,
      category: 'food',
      date: '2026-09-24',
    }
    assert.equal(await store.addTransaction(expense), true)
    const transactionId = store.transactions[0].id
    assert.equal(store.totalBalance, 80)
    assert.equal(store.categories.find((c) => c.id === 'food').amount, 20)
    await store.init()
    assert.equal(store.transactions.length, 1, 'navigation preserves records')
    await store.updateTransaction(transactionId, { ...expense, amount: 30 })
    assert.equal(store.totalBalance, 70)
    assert.equal(await store.deleteAccount(id), false, 'linked accounts cannot be deleted')
    fail = true
    assert.equal(await store.addTransaction(expense), false)
    assert.equal(store.transactions.length, 1, 'failed saves do not modify state')
    fail = false
    store.reset()
    await store.init()
    assert.equal(store.totalBalance, 70, 'reload restores saved records')
    await store.deleteTransaction(transactionId)
    assert.equal(store.totalBalance, 100, 'deleting an expense reverses its balance effect')
    await store.addAccount({ name: 'Credit', type: 'credit', balance: 50 })
    const credit = store.accounts.find((a) => a.type === 'credit')
    await store.addTransaction({ ...expense, account: credit.id })
    assert.equal(store.accounts.find((a) => a.id === credit.id).balance, 70)
    assert.equal(store.totalBalance, 30)
    await store.addAccount({ name: 'Emergency savings', type: 'savings', balance: 0 })
    const savings = store.accounts.find((a) => a.type === 'savings')
    const transfer = { ...expense, type: 'transfer', toAccount: savings.id, amount: 25 }
    assert.equal(await store.addTransaction(transfer), true)
    assert.equal(store.totalBalance, 30, 'transfers preserve net worth')
    assert.equal(store.totalExpenses, 20, 'transfers are not expenses')
    assert.equal(store.totalIncome, 0, 'transfers are not income')
    assert.equal(store.savingsBalance, 25)
    assert.equal(
      await store.saveGoal({ name: 'Emergency fund', account: savings.id, target: 100 }),
      true,
    )
    assert.equal(store.goals[0].percent, 25)
    assert.equal(
      await store.saveGoal({ name: 'Duplicate allocation', account: savings.id, target: 200 }),
      false,
    )
    assert.equal(
      await store.addTransaction({ ...transfer, toAccount: id }),
      false,
      'cannot transfer to self',
    )
    assert.equal(await store.addTransaction({ ...expense, date: '2026-02-30' }), false)
    assert.equal(await store.addTransaction({ ...expense, amount: 0.001 }), false)
    store.selectedMonth = '2026-09'
    assert.equal(await store.saveBudget({ month: '2026-09', amount: 25 }), true)
    assert.equal(store.overallBudget.status, 'warning', '80% warns')
    assert.equal(await store.saveBudget({ month: '2026-09', amount: 10 }), true)
    assert.equal(store.overallBudget.remaining, -10)
    assert.equal(store.overallBudget.status, 'over')
    assert.equal(store.budgets.length, 1, 'editing a budget does not duplicate it')
    store.selectedMonth = '2026-08'
    assert.equal(store.monthly.expenses, 0)
    assert.equal(store.overallBudget, null)
    await store.init(true)
    assert.equal(store.goals[0].saved, 25, 'goals survive reload')
    assert.equal(store.budgets.length, 1, 'budgets survive reload')
    row.version += 1
    assert.equal(
      await store.addTransaction(expense),
      false,
      'stale sessions cannot overwrite newer data',
    )
    assert.match(store.error, /another session/)
    await store.init(true)
    assert.equal(await store.addTransaction({ ...expense, amount: -1 }), false)
  } finally {
    await server.close()
  }
})
