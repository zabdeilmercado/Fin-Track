// Transaction types
export const TRANSACTION_TYPES = [
  { title: 'Expense', value: 'expense' },
  { title: 'Income', value: 'income' },
]

// Category options
export const CATEGORY_OPTIONS = [
  { title: 'Food', value: 'food' },
  { title: 'Transportation', value: 'transportation' },
  { title: 'Entertainment', value: 'entertainment' },
  { title: 'Housing', value: 'housing' },
  { title: 'Utilities', value: 'utilities' },
  { title: 'Income', value: 'income' },
  { title: 'Uncategorized', value: 'uncategorized' },
]

// Account type options
export const ACCOUNT_TYPE_OPTIONS = [
  { title: 'Savings', value: 'savings' },
]

// Available icons for categories
export const CATEGORY_ICONS = [
  { title: 'Tag', value: 'mdi-tag-outline' },
  { title: 'Food', value: 'mdi-food' },
  { title: 'Shopping', value: 'mdi-cart-outline' },
  { title: 'Transportation', value: 'mdi-car' },
  { title: 'Entertainment', value: 'mdi-movie-outline' },
  { title: 'Housing', value: 'mdi-home-outline' },
  { title: 'Utilities', value: 'mdi-lightning-bolt-outline' },
  { title: 'Health', value: 'mdi-medical-bag' },
  { title: 'Education', value: 'mdi-school-outline' },
  { title: 'Income', value: 'mdi-currency-usd' },
]

// Available colors for categories
export const CATEGORY_COLORS = [
  { title: 'Primary', value: 'primary' },
  { title: 'Secondary', value: 'secondary' },
  { title: 'Success', value: 'success' },
  { title: 'Info', value: 'info' },
  { title: 'Warning', value: 'warning' },
  { title: 'Error', value: 'error' },
]

// Transaction table headers
export const TRANSACTION_HEADERS = [
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Description', key: 'description', sortable: true },
  { title: 'Category', key: 'category', sortable: true },
  { title: 'Account', key: 'account', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]
