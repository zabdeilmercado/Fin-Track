/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(value)
}

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Get color for a category
 * @param {string} category - The category name
 * @returns {string} Color name
 */
export const getCategoryColor = (category) => {
  const categoryMap = {
    food: 'success',
    transportation: 'info',
    entertainment: 'secondary',
    housing: 'primary',
    utilities: 'warning',
    income: 'error',
    uncategorized: 'grey',
  }

  return categoryMap[category] || 'grey'
}

/**
 * Get icon for a category
 * @param {string} category - The category name
 * @returns {string} Icon name
 */
export const getCategoryIcon = (category) => {
  const iconMap = {
    food: 'mdi-food',
    transportation: 'mdi-car',
    entertainment: 'mdi-movie-outline',
    housing: 'mdi-home-outline',
    utilities: 'mdi-lightning-bolt-outline',
    income: 'mdi-currency-usd',
    uncategorized: 'mdi-tag-outline',
  }

  return iconMap[category] || 'mdi-tag-outline'
}

/**
 * Get color for an account type
 * @param {string} type - The account type
 * @returns {string} Color name
 */
export const getAccountColor = (type) => {
  const typeMap = {
    checking: 'primary',
    savings: 'success',
    cash: 'warning',
    credit: 'error',
    investment: 'secondary',
  }

  return typeMap[type] || 'grey'
}

/**
 * Get icon for an account type
 * @param {string} type - The account type
 * @returns {string} Icon name
 */
export const getAccountIcon = (type) => {
  const iconMap = {
    checking: 'mdi-bank-outline',
    savings: 'mdi-piggy-bank-outline',
    cash: 'mdi-cash',
    credit: 'mdi-credit-card-outline',
    investment: 'mdi-chart-line',
  }

  return iconMap[type] || 'mdi-wallet-outline'
}
