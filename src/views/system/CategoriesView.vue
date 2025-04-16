<script setup>
import PageLayout from '@/components/common/PageLayout.vue'
import CategoryCard from '@/components/common/CategoryCard.vue'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import { ref } from 'vue'

const categories = ref([
  { id: 1, name: 'Food', description: 'Daily meals', icon: 'mdi-food', usage: 60 },
  { id: 2, name: 'Transport', description: 'Bus, taxi', icon: 'mdi-bus', usage: 30 },
])

const addDialog = ref(false)
const deleteDialog = ref(false)
const form = ref({ name: '', description: '' })
const selectedCategory = ref(null)

function openAddDialog() {
  form.value = { name: '', description: '' }
  addDialog.value = true
}
function openEditDialog(category) {
  form.value = { ...category }
  addDialog.value = true
}
function openDeleteDialog(category) {
  selectedCategory.value = category
  deleteDialog.value = true
}
function addCategory() {
  addDialog.value = false
}
function confirmDelete() {
  deleteDialog.value = false
}
</script>

<template>
  <PageLayout title="Categories" subtitle="Organize your income and expenses">
    <template #action>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">Add Category</v-btn>
    </template>

    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="category in categories" :key="category.id">
        <CategoryCard
          v-bind="category"
          @edit="openEditDialog(category)"
          @delete="openDeleteDialog(category)"
        />
      </v-col>
    </v-row>

    <DialogWrapper
      :model-value="addDialog"
      title="Add Category"
      @update:model-value="addDialog = $event"
    >
      <v-text-field label="Name" v-model="form.name" />
      <v-text-field label="Description" v-model="form.description" />
      <template #actions>
        <v-btn text @click="addDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="addCategory">Save</v-btn>
      </template>
    </DialogWrapper>

    <DialogWrapper
      :model-value="deleteDialog"
      title="Delete Category"
      @update:model-value="deleteDialog = $event"
    >
      Are you sure you want to delete this category?
      <template #actions>
        <v-btn text @click="deleteDialog = false">Cancel</v-btn>
        <v-btn color="red" @click="confirmDelete">Delete</v-btn>
      </template>
    </DialogWrapper>
  </PageLayout>
</template>
