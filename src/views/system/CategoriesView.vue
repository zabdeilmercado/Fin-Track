<script setup>
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency } from '@/utils/formatters'
import DashboardLayout from '@/components/DashboardLayout.vue'
import EmptyState from '@/components/EmptyState.vue'
import CategoryForm from '@/components/CategoryForm.vue'

const financeStore = useFinanceStore()

// Dialog state
const categoryDialog = ref(false)
const deleteCategoryDialog = ref(false)
const isEditMode = ref(false)
const selectedCategory = ref(null)
const categoryData = ref({
  id: null,
  name: '',
  description: '',
  icon: 'mdi-tag-outline',
  color: 'primary',
  count: 0,
  amount: 0,
  percentage: 0,
})

// Category methods
const openNewCategoryDialog = () => {
  isEditMode.value = false
  categoryData.value = {
    id: null,
    name: '',
    description: '',
    icon: 'mdi-tag-outline',
    color: 'primary',
    count: 0,
    amount: 0,
    percentage: 0,
  }
  categoryDialog.value = true
}

const openEditCategoryDialog = (category) => {
  isEditMode.value = true
  selectedCategory.value = category
  categoryData.value = { ...category }
  categoryDialog.value = true
}

const openDeleteCategoryDialog = (category) => {
  selectedCategory.value = category
  deleteCategoryDialog.value = true
}

const closeCategoryDialog = () => {
  categoryDialog.value = false
}

const closeDeleteCategoryDialog = () => {
  deleteCategoryDialog.value = false
}

const deleteCategory = () => {
  financeStore.deleteCategory(selectedCategory.value.id)
  closeDeleteCategoryDialog()
}

const saveCategory = (category) => {
  if (isEditMode.value && selectedCategory.value) {
    financeStore.updateCategory(selectedCategory.value.id, category)
  } else {
    financeStore.addCategory(category)
  }
  closeCategoryDialog()
}

onMounted(() => {
  financeStore.init()
})
</script>

<template>
  <DashboardLayout pageTitle="Categories" activeItem="categories">
    <v-row>
      <v-col cols="12">
        <v-row align="center" class="mb-6">
          <v-col cols="auto">
            <h1 class="text-h4 font-weight-bold">Categories</h1>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openNewCategoryDialog">
              Add Category
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Categories Grid -->
    <v-row v-if="financeStore.categories.length > 0">
      <v-col
        v-for="(category, index) in financeStore.categories"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="h-100">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar :color="category.color" size="40" variant="tonal">
                <v-icon>{{ category.icon }}</v-icon>
              </v-avatar>
            </template>
            <v-card-title>{{ category.name }}</v-card-title>
            <template v-slot:append>
              <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn icon variant="text" size="small" v-bind="props">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="openEditCategoryDialog(category)">
                    <template v-slot:prepend>
                      <v-icon>mdi-pencil</v-icon>
                    </template>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openDeleteCategoryDialog(category)">
                    <template v-slot:prepend>
                      <v-icon>mdi-delete</v-icon>
                    </template>
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-card-item>
          <v-card-text>
            <p v-if="category.description" class="text-body-2 mb-4">{{ category.description }}</p>
            <v-row>
              <v-col cols="6">
                <div class="text-overline text-medium-emphasis">Transactions</div>
                <div class="text-h6">{{ category.count || 0 }}</div>
              </v-col>
              <v-col cols="6">
                <div class="text-overline text-medium-emphasis">Amount</div>
                <div class="text-h6">{{ formatCurrency(category.amount || 0) }}</div>
              </v-col>
            </v-row>
            <v-progress-linear
              v-if="category.percentage"
              :model-value="category.percentage"
              :color="category.color"
              height="8"
              rounded
              class="mt-2"
            ></v-progress-linear>
            <div v-if="category.percentage" class="text-caption text-end mt-1">
              {{ category.percentage }}% of total
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <EmptyState
      v-else
      icon="mdi-tag-outline"
      title="No Categories Found"
      description="Create categories to organize your transactions and track spending patterns."
      actionText="Add Your First Category"
      actionIcon="mdi-plus"
      @action="openNewCategoryDialog"
    />

    <!-- Uncategorized Transactions Alert -->
    <v-alert
      v-if="financeStore.uncategorizedCount > 0"
      color="warning"
      variant="tonal"
      class="mt-6"
    >
      <div class="d-flex flex-column flex-sm-row align-center">
        <div>
          <v-alert-title>Uncategorized Transactions</v-alert-title>
          <p>
            You have {{ financeStore.uncategorizedCount }} uncategorized transactions totaling
            {{ formatCurrency(financeStore.uncategorizedAmount) }}.
          </p>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="warning" variant="text" class="mt-3 mt-sm-0" to="/transactions">
          Review Transactions
        </v-btn>
      </div>
    </v-alert>

    <!-- Add/Edit Category Dialog -->
    <v-dialog v-model="categoryDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ isEditMode ? 'Edit Category' : 'New Category' }}</v-card-title>
        <CategoryForm
          :category="categoryData"
          @submit="saveCategory"
          @cancel="closeCategoryDialog"
        />
      </v-card>
    </v-dialog>

    <!-- Delete Category Dialog -->
    <v-dialog v-model="deleteCategoryDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete Category</v-card-title>
        <v-card-text>
          Are you sure you want to delete this category? Transactions with this category will be
          marked as uncategorized.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="closeDeleteCategoryDialog">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deleteCategory">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </DashboardLayout>
</template>
