<script setup>
import { ref, reactive, onMounted } from 'vue'
import { TRANSACTION_TYPES, CATEGORY_OPTIONS } from '@/utils/constants'
import { getCategoryColor, getCategoryIcon } from '@/utils/formatters'

const props = defineProps({
  transaction: {
    type: Object,
    default: () => ({
      description: '',
      amount: 0,
      type: 'expense',
      date: new Date().toISOString().substr(0, 10),
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
const dateMenu = ref(false)
const transactionTypes = TRANSACTION_TYPES
const categoryOptions = CATEGORY_OPTIONS

const formData = reactive({ ...props.transaction })

const submitForm = () => {
  if (!valid.value) return
  emit('submit', { ...formData })
}

onMounted(() => {
  // Initialize form with provided transaction data
  Object.assign(formData, props.transaction)
})
</script>

<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-container>
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
            prefix="$"
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
          <v-menu v-model="dateMenu" :close-on-content-click="false" location="bottom">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="formData.date"
                label="Date"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="props"
                :rules="[(v) => !!v || 'Date is required']"
                required
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.date"
              @update:model-value="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
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
            label="Account"
            required
            :rules="[(v) => !!v || 'Account is required']"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="formData.notes" label="Notes" rows="2"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" variant="text" @click="$emit('cancel')">Cancel</v-btn>
      <v-btn color="primary" variant="text" type="submit" :disabled="!valid"> Save </v-btn>
    </v-card-actions>
  </v-form>
</template>

