
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/utils/constants'

const props = defineProps({
  category: {
    type: Object,
    default: () => ({
      name: '',
      description: '',
      icon: 'mdi-tag-outline',
      color: 'primary',
      count: 0,
      amount: 0,
      percentage: 0,
    }),
  },
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref(null)
const valid = ref(false)
const availableIcons = CATEGORY_ICONS
const availableColors = CATEGORY_COLORS

const formData = reactive({ ...props.category })

const submitForm = () => {
  if (!valid.value) return
  emit('submit', { ...formData })
}

onMounted(() => {
  // Initialize form with provided category data
  Object.assign(formData, props.category)
})
</script>

<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="formData.name"
            label="Category Name"
            :rules="[(v) => !!v || 'Name is required']"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="formData.description" label="Description" rows="2"></v-textarea>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formData.icon"
            :items="availableIcons"
            label="Icon"
            required
            :rules="[(v) => !!v || 'Icon is required']"
          >
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon>{{ item.value }}</v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formData.color"
            :items="availableColors"
            label="Color"
            required
            :rules="[(v) => !!v || 'Color is required']"
          >
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar :color="item.value" size="24"></v-avatar>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
            <template v-slot:selection="{ item }">
              <v-chip :color="item.value" class="mr-2">
                <template v-slot:prepend>
                  <v-avatar :color="item.value" size="16"></v-avatar>
                </template>
                {{ item.title }}
              </v-chip>
            </template>
          </v-select>
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
