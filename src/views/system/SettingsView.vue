<script setup>
import { computed, onMounted } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import { useFinanceStore } from '@/stores/finance'
import { installPrompt, installApp, appInstalled, online } from '@/services/appInstall'
const store = useFinanceStore()
const lastSync = computed(() =>
  store.lastSynced ? new Date(store.lastSynced).toLocaleString() : 'Not synced yet',
)
const download = (content, filename, type) => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
const exportJson = () => download(store.exportData(), 'fintrack-export.json', 'application/json')
const exportCsv = () => {
  const cell = (value) =>
    '"' +
    String(value ?? '')
      .replace(/^[=+\-@\t\r]/, "'$&")
      .replaceAll('"', '""') +
    '"'
  const rows = [
    ['Date', 'Type', 'Description', 'Amount (PHP)', 'Account', 'To account', 'Category', 'Notes'],
    ...store.transactions.map((t) => [
      t.date,
      t.type,
      t.description,
      t.amount,
      store.accountName(t.account),
      t.toAccount ? store.accountName(t.toAccount) : '',
      t.category ? store.categoryName(t.category) : '',
      t.notes,
    ]),
  ]
  download(
    '\uFEFF' + rows.map((row) => row.map(cell).join(',')).join('\r\n'),
    'fintrack-transactions.csv',
    'text/csv;charset=utf-8',
  )
}
onMounted(() => store.init())
</script>

<template>
  <DashboardLayout pageTitle="Settings" activeItem="settings">
    <h1 class="text-h4 mb-2">Make FinTrack yours</h1>
    <p class="text-medium-emphasis mb-6">
      Your money, in Philippine pesos, available wherever you sign in.
    </p>
    <v-row
      ><v-col cols="12" md="6"
        ><v-card
          rounded="xl"
          border
          title="Install FinTrack"
          prepend-icon="mdi-cellphone-arrow-down"
          ><v-card-text>
            <p v-if="appInstalled">You’re already using the installed app.</p>
            <template v-else
              ><p class="mb-4">
                Add FinTrack to your phone or desktop home screen for quick access.
              </p>
              <v-btn v-if="installPrompt" color="primary" @click="installApp">Install app</v-btn>
              <p v-else>
                In Chrome or Edge, open the browser menu and choose “Install app” when available. On
                iPhone, open this site in Safari, tap Share, then “Add to Home Screen”.
              </p></template
            >
            <p class="text-caption mt-4">
              An internet connection is required to load and save your synced finances. Installation
              is available on the deployed HTTPS site.
            </p>
          </v-card-text></v-card
        ></v-col
      >
      <v-col cols="12" md="6"
        ><v-card rounded="xl" border title="Your cloud data" prepend-icon="mdi-cloud-check-outline"
          ><v-card-text>
            <v-chip :color="online ? 'success' : 'warning'" class="mb-3">{{
              online ? 'Online' : 'Offline — reconnect to sync'
            }}</v-chip>
            <p>Last successful sync: {{ lastSync }}</p>
            <p class="mt-2">
              Sign in with the same account on your other devices. Reload to fetch the latest
              changes before editing.
            </p>
            <v-btn
              class="mt-4"
              variant="tonal"
              :loading="store.isLoading"
              :disabled="!online || store.isSaving"
              @click="store.init(true)"
              >Sync now</v-btn
            >
          </v-card-text></v-card
        ></v-col
      >
      <v-col cols="12"
        ><v-card rounded="xl" border title="Export your records" prepend-icon="mdi-download-outline"
          ><v-card-text
            ><p class="mb-4">
              Download all records as JSON, or transactions as a spreadsheet-friendly CSV. These
              files contain your financial information; keep them somewhere private.
            </p>
            <div class="d-flex flex-wrap ga-3">
              <v-btn
                :disabled="!store.lastSynced || store.isLoading"
                variant="tonal"
                @click="exportJson"
                >Export all data (JSON)</v-btn
              ><v-btn
                :disabled="!store.lastSynced || store.isLoading"
                variant="tonal"
                @click="exportCsv"
                >Export transactions (CSV)</v-btn
              >
            </div></v-card-text
          ></v-card
        ></v-col
      >
      <v-col cols="12"
        ><v-card rounded="xl" border title="How your numbers work"
          ><v-card-text
            ><ul class="pl-5">
              <li class="mb-2">
                Income adds to an account. Expenses reduce it. Credit card balances represent debt.
              </li>
              <li class="mb-2">
                A transfer moves money between accounts, including credit-card repayments. It does
                not count toward spending or income.
              </li>
              <li class="mb-2">
                “Kept from income” means income minus expenses in the chosen month. Your savings
                accounts show the money you have actually set aside.
              </li>
              <li class="mb-2">
                Budget limits apply only to the month you choose. Set a new limit for each month.
              </li>
              <li>
                Only record completed transactions, dated today or earlier. FinTrack does not
                connect to your bank or move real money.
              </li>
            </ul></v-card-text
          ></v-card
        ></v-col
      >
    </v-row>
  </DashboardLayout>
</template>
