<script setup>
import { today } from '@/utils/financeMath'
import { ref, reactive, watch, computed } from 'vue'
import { TRANSACTION_TYPES } from '@/utils/constants'
import { useFinanceStore } from '@/stores/finance'
import { getCategoryColor, getCategoryIcon } from '@/utils/formatters'

const props = defineProps({
  transaction: {
    type: Object,
    default: () => ({
      description: '',
      amount: 0,
      type: 'expense',
      date: today(),
      category: '',
      account: '',
      notes: '',
    }),
  },
  accountOptions: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref(null)
const valid = ref(false)
const financeStore = useFinanceStore()
const transactionTypes = TRANSACTION_TYPES
const categoryOptions = computed(() =>
  financeStore.categories.map((c) => ({ title: c.name, value: c.id })),
)

const formData = reactive({
  account: '',
})

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return
  emit('submit', { ...formData })
}

watch(
  () => props.transaction,
  () => {
    // Initialize form with provided transaction data
    Object.assign(formData, { toAccount: '' }, props.transaction)
  },
  { immediate: true },
)
</script>

<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <v-alert v-if="financeStore.error" type="error" class="mb-4">{{
        financeStore.error
      }}</v-alert>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.description"
            label="Description"
            :rules="[(v) => !!v || 'Description is required']"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="formData.amount"
            label="Amount"
            prefix="₱"
            step="0.01"
            type="number"
            :rules="[
              (v) => !!v || 'Amount is required',
              (v) => v > 0 || 'Amount must be greater than 0',
            ]"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formData.type"
            :items="transactionTypes"
            label="Type"
            required
            :rules="[(v) => !!v || 'Type is required']"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.date"
            type="date"
            label="Date"
            :rules="[(v) => !!v || 'Date is required']"
            required
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-if="formData.type !== 'transfer'"
            v-model="formData.category"
            :items="categoryOptions"
            label="Category"
            required
            :rules="[(v) => !!v || 'Category is required']"
          >
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar :color="getCategoryColor(item.value)" size="24" variant="tonal">
                    <v-icon size="small">{{ getCategoryIcon(item.value) }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formData.account"
            :items="accountOptions"
            :label="formData.type === 'transfer' ? 'From account' : 'Account'"
            required
            :rules="[(v) => !!v || 'Account is required']"
          ></v-select>
        </v-col>
        <v-col v-if="formData.type === 'transfer'" cols="12">
          <v-select
            v-model="formData.toAccount"
            :items="accountOptions.filter((a) => a.value !== formData.account)"
            label="To account"
            :rules="[(v) => !!v || 'Choose a destination account']"
          />
          <p class="text-caption">
            Transfers move money between your accounts without counting as income or expenses.
          </p>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="formData.notes" label="Notes" rows="2"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" variant="text" @click="$emit('cancel')">Cancel</v-btn>
      <v-btn
        color="primary"
        variant="text"
        type="submit"
        :disabled="!valid || financeStore.isLoading || financeStore.isSaving"
        :loading="financeStore.isSaving"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-form>
</template>
