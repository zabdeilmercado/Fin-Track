<script setup>
import { useFinanceStore } from '@/stores/finance'
import { ref, reactive, watch } from 'vue'
import { ACCOUNT_TYPE_OPTIONS } from '@/utils/constants'
import { getAccountIcon } from '@/utils/formatters'

const props = defineProps({
  account: {
    type: Object,
    default: () => ({
      name: '',
      type: 'savings',
      balance: 0,
      notes: '',
    }),
  },
})

const emit = defineEmits(['submit', 'cancel'])

const financeStore = useFinanceStore()
const form = ref(null)
const valid = ref(false)
const accountTypeOptions = ACCOUNT_TYPE_OPTIONS

const formData = reactive({ ...props.account })

const submitForm = () => {
  if (!valid.value) return
  emit('submit', { ...formData })
}

watch(
  () => props.account,
  () => {
    // Initialize form with provided account data
    Object.assign(formData, props.account)
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
        <v-col cols="12">
          <v-text-field
            v-model="formData.name"
            label="Account Name"
            maxlength="80"
            counter
            :rules="[(v) => !!v || 'Name is required']"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="formData.type"
            :items="accountTypeOptions"
            label="Account Type"
            required
            :rules="[(v) => !!v || 'Account type is required']"
          >
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon>{{ getAccountIcon(item.value) }}</v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model.number="formData.balance"
            label="Balance"
            prefix="₱"
            step="0.01"
            type="number"
            :rules="[
              (v) =>
                (v !== '' && v !== null && Number.isFinite(Number(v))) ||
                'A valid balance is required',
            ]"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="formData.notes"
            label="Notes"
            rows="2"
            maxlength="500"
            counter
          ></v-textarea>
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
