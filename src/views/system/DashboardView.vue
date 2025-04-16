<script setup>
import PageLayout from '@/components/common/PageLayout.vue'
import StatCard from '@/components/common/StatCard.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const stats = ref([
  { title: 'Total Balance', value: '₱10,000', icon: 'mdi-bank', color: 'green' },
  { title: 'Total Income', value: '₱15,000', icon: 'mdi-cash-plus', color: 'blue' },
  { title: 'Total Expense', value: '₱5,000', icon: 'mdi-cash-minus', color: 'red' },
])

const recentTransactions = ref([
  { id: 1, name: 'Grocery', amount: 1500, date: '2025-04-14' },
  { id: 2, name: 'Salary', amount: 15000, date: '2025-04-10' },
])

const topCategories = ref([
  { id: 1, percentage: 60, color: 'red' },
  { id: 2, percentage: 40, color: 'blue' },
])

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}
function goToTransaction() {
  router.push('/transactions')
}
</script>

<template>
  <PageLayout title="Dashboard" subtitle="Overview of your financial data">
    <template #action>
      <v-btn prepend-icon="mdi-plus" color="primary" @click="goToTransaction"
        >Add Transaction</v-btn
      >
    </template>

    <v-row>
      <v-col cols="12" md="4" v-for="stat in stats" :key="stat.title">
        <StatCard v-bind="stat" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <h3 class="text-h6 font-weight-medium mb-2">Recent Transactions</h3>
          <v-list>
            <v-list-item v-for="t in recentTransactions" :key="t.id">
              <v-list-item-title>{{ t.name }} - ₱{{ t.amount }}</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(t.date) }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <h3 class="text-h6 font-weight-medium mb-2">Category Breakdown</h3>
          <v-progress-circular
            v-for="c in topCategories"
            :key="c.id"
            :value="c.percentage"
            :rotate="270"
            :size="80"
            :width="10"
            :color="c.color"
            class="mr-4"
          >
            {{ c.percentage }}%
          </v-progress-circular>
        </v-card>
      </v-col>
    </v-row>
  </PageLayout>
</template>
