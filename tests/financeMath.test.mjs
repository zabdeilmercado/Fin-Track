import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  accountEffect,
  budgetProgress,
  monthSummary,
  validDate,
  money,
  today,
} from '../src/utils/financeMath.js'

test('validates dates and amounts without silently accepting impossible dates', () => {
  assert.equal(validDate('2024-02-29'), true)
  assert.equal(validDate('2025-02-29'), false)
  assert.equal(validDate('2026-13-01'), false)
  assert.equal(validDate(''), false)
  assert.equal(validDate(today()), true)
  assert.throws(() => money(Infinity))
  assert.throws(() => money(-1))
  assert.throws(() => money(''))
  assert.throws(() => money(0.001))
  assert.equal(money(12.345), 12.35)
})
test('spending, income and retained money stay separate from transfers', () => {
  const transactions = [
    { type: 'income', amount: 1000, date: '2026-09-01' },
    { type: 'expense', amount: 300, date: '2026-09-20' },
    { type: 'transfer', amount: 200, date: '2026-09-21' },
    { type: 'expense', amount: 400, date: '2026-08-31' },
  ]
  assert.deepEqual(monthSummary(transactions, '2026-09'), {
    income: 1000,
    expenses: 300,
    retained: 700,
    savingsRate: 70,
  })
  assert.equal(budgetProgress(300, 301).remaining, -1)
  assert.equal(budgetProgress(300, 300).status, 'warning')
  assert.equal(budgetProgress(300, 100).status, 'good')
})
test('credit repayment reduces debt and cash by the same amount', () => {
  const transfer = { type: 'transfer', account: 'cash', toAccount: 'card', amount: 500 }
  assert.equal(accountEffect(transfer, { id: 'cash', type: 'cash' }), -500)
  assert.equal(accountEffect(transfer, { id: 'card', type: 'credit' }), -500)
  assert.equal(accountEffect(transfer, { id: 'other', type: 'savings' }), 0)
})
