<script setup>
import PageLayout from '@/components/common/PageLayout.vue'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import { ref } from 'vue'

const dialog = ref(false)
const form = ref({ name: '', amount: '' })
const transactions = ref([
  { id: 1, name: 'Grocery', amount: 1000 },
  { id: 2, name: 'Salary', amount: 15000 },
])
const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Amount', value: 'amount' },
  { text: 'Actions', value: 'actions', sortable: false },
]

function openDialog() {
  form.value = { name: '', amount: '' }
  dialog.value = true
}
function editTransaction(t) {
  form.value = { ...t }
  dialog.value = true
}
function deleteTransaction(t) {
  // Logic
}
function saveTransaction() {
  dialog.value = false
}
</script>

<template>
  <PageLayout title="Transactions" subtitle="All your financial records">
    <template #action>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">New</v-btn>
    </template>

    <v-data-table :items="transactions" :headers="headers" class="elevation-1">
      <template #item.actions="{ item }">
        <v-btn icon size="small" @click="editTransaction(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" @click="deleteTransaction(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <DialogWrapper
      :model-value="dialog"
      title="Add/Edit Transaction"
      @update:model-value="dialog = $event"
    >
      <v-text-field label="Name" v-model="form.name" />
      <v-text-field label="Amount" type="number" v-model="form.amount" />
      <template #actions>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="saveTransaction">Save</v-btn>
      </template>
    </DialogWrapper>
  </PageLayout>
</template>

