<script setup>
import { ref } from 'vue'

// User data - in a real app, this would come from your API or store
const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  walletBalance: 5280.42,
  walletId: 'WT-8547-3921-4730',
  joinDate: 'January 15, 2023'
})

// Form fields for editing
const editMode = ref(false)
const editedUser = ref({ ...user.value })

// Toggle edit mode
const toggleEditMode = () => {
  if (editMode.value) {
    // Save changes
    user.value = { ...editedUser.value }
    editMode.value = false
  } else {
    // Enter edit mode
    editedUser.value = { ...user.value }
    editMode.value = true
  }
}

// Cancel editing
const cancelEdit = () => {
  editMode.value = false
  editedUser.value = { ...user.value }
}

// File upload for avatar
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editedUser.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Profile</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Profile Information Card -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Personal Information</span>
            <v-btn
              :color="editMode ? 'success' : 'primary'"
              @click="toggleEditMode"
              variant="tonal"
            >
              {{ editMode ? 'Save Changes' : 'Edit Profile' }}
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="12" md="6">
  <v-text-field
    v-model="editedUser.name"
    label="Full Name"
    prepend-inner-icon="mdi-account"
    variant="outlined"
    :readonly="!editMode"
  ></v-text-field>
</v-col>

<v-col cols="12" md="6">
  <v-text-field
    v-model="editedUser.email"
    label="Email"
    prepend-inner-icon="mdi-email"
    variant="outlined"
    :readonly="!editMode"
  ></v-text-field>
</v-col>

<v-col cols="12" md="6">
  <v-text-field
    v-model="editedUser.phone"
    label="Phone Number"
    prepend-inner-icon="mdi-phone"
    variant="outlined"
    :readonly="!editMode"
  ></v-text-field>
</v-col>

<v-col cols="12" md="6">
  <v-text-field
    v-model="user.joinDate"
    label="Member Since"
    prepend-inner-icon="mdi-calendar"
    variant="outlined"
    readonly
  ></v-text-field>
</v-col>

              </v-row>
              
              <v-row v-if="editMode">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    color="error"
                    variant="text"
                    class="mr-2"
                    @click="cancelEdit"
                  >
                    Cancel
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Profile Picture and Wallet Card -->
      <v-col cols="12" md="4">
        <v-card class="mb-6">
          <v-card-text class="text-center">
            <v-avatar size="150" class="mb-4">
              <v-img :src="editMode ? editedUser.avatar : user.avatar" alt="Profile Picture"></v-img>
            </v-avatar>
            
            <div v-if="editMode" class="mb-4">
              <v-file-input
                label="Change Profile Picture"
                accept="image/*"
                prepend-icon="mdi-camera"
                variant="outlined"
                density="compact"
                @change="onFileChange"
              ></v-file-input>
            </div>
            
            <h2 class="text-h5 mb-1">{{ user.name }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis">{{ user.email }}</p>
          </v-card-text>
        </v-card>
        
        <v-card>
          <v-card-title>Wallet Information</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-wallet</v-icon>
                </template>
                <v-list-item-title>Wallet ID</v-list-item-title>
                <v-list-item-subtitle>{{ user.walletId }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success">mdi-cash</v-icon>
                </template>
                <v-list-item-title>Balance</v-list-item-title>
                <v-list-item-subtitle class="text-h6 text-success">
                  ${{ user.walletBalance.toFixed(2) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            
            <v-btn
              block
              color="primary"
              variant="tonal"
              prepend-icon="mdi-cash-plus"
              class="mt-4"
            >
              Add Funds
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>