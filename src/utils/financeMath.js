export const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100
export const today = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export const validDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}
export const validMonth = (value) =>
  typeof value === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
export function money(value, allowZero = false, allowNegative = false) {
  const number = Number(value)
  if (
    value === '' ||
    value == null ||
    !Number.isFinite(number) ||
    Math.abs(number) > 1e12 ||
    (!allowNegative && number < 0) ||
    (!allowZero && roundMoney(number) === 0)
  ) {
    throw new Error('Enter a valid amount' + (allowZero ? '.' : ' greater than zero.'))
  }
  return roundMoney(number)
}
export function accountEffect(transaction, account) {
  let amount = 0
  if (transaction.type === 'transfer') {
    if (transaction.account === account.id) amount -= transaction.amount
    if (transaction.toAccount === account.id) amount += transaction.amount
  } else if (transaction.account === account.id) {
    amount = transaction.type === 'income' ? transaction.amount : -transaction.amount
  }
  return amount * (account.type === 'credit' ? -1 : 1)
}
export function monthSummary(transactions, month) {
  if (!validMonth(month)) return { income: 0, expenses: 0, retained: 0, savingsRate: 0 }
  const entries = transactions.filter((t) => t.date.startsWith(month))
  const income = roundMoney(
    entries.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
  )
  const expenses = roundMoney(
    entries.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
  )
  return {
    income,
    expenses,
    retained: roundMoney(income - expenses),
    savingsRate: income ? Math.round(((income - expenses) / income) * 100) : 0,
  }
}
export function budgetProgress(limit, spent) {
  const remaining = roundMoney(limit - spent)
  return {
    limit,
    spent,
    remaining,
    percent: limit > 0 ? Math.round((spent / limit) * 100) : 0,
    status: spent > limit ? 'over' : spent >= limit * 0.8 ? 'warning' : 'good',
  }
}
