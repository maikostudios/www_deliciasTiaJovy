import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore'
import { db } from '@/main.js'

export const useCustomersStore = defineStore('customers', () => {
  // State
  const customers = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const totalCustomers = computed(() => customers.value.length)
  
  const customersWithBirthdays = computed(() => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()
    
    return customers.value.filter(customer => {
      if (!customer.birthDate) return false
      const birthDate = new Date(customer.birthDate)
      return birthDate.getMonth() === currentMonth && birthDate.getDate() === currentDay
    })
  })

  const upcomingBirthdays = computed(() => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return customers.value.filter(customer => {
      if (!customer.birthDate) return false
      const birthDate = new Date(customer.birthDate)
      const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
      
      return thisYearBirthday >= today && thisYearBirthday <= nextWeek
    }).sort((a, b) => {
      const aDate = new Date(today.getFullYear(), new Date(a.birthDate).getMonth(), new Date(a.birthDate).getDate())
      const bDate = new Date(today.getFullYear(), new Date(b.birthDate).getMonth(), new Date(b.birthDate).getDate())
      return aDate - bDate
    })
  })

  // Actions
  async function fetchCustomers() {
    try {
      loading.value = true
      error.value = null

      const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      customers.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching customers:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function addCustomer(customerData) {
    try {
      loading.value = true
      error.value = null

      const newCustomer = {
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const docRef = await addDoc(collection(db, 'customers'), newCustomer)
      
      // Add to local state
      customers.value.unshift({
        id: docRef.id,
        ...newCustomer
      })

      return { success: true, customerId: docRef.id }
    } catch (err) {
      error.value = err.message
      console.error('Error adding customer:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateCustomer(customerId, updates) {
    try {
      loading.value = true
      error.value = null

      const customerRef = doc(db, 'customers', customerId)
      const updateData = {
        ...updates,
        updatedAt: new Date()
      }

      await updateDoc(customerRef, updateData)
      
      // Update local state
      const index = customers.value.findIndex(c => c.id === customerId)
      if (index !== -1) {
        customers.value[index] = {
          ...customers.value[index],
          ...updateData
        }
      }

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error updating customer:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function deleteCustomer(customerId) {
    try {
      loading.value = true
      error.value = null

      await deleteDoc(doc(db, 'customers', customerId))
      
      // Remove from local state
      customers.value = customers.value.filter(c => c.id !== customerId)

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error deleting customer:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function findCustomerByEmail(email) {
    try {
      const q = query(collection(db, 'customers'), where('email', '==', email))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        return {
          id: doc.id,
          ...doc.data()
        }
      }
      
      return null
    } catch (err) {
      console.error('Error finding customer by email:', err)
      return null
    }
  }

  async function createOrUpdateCustomer(customerData) {
    try {
      // Check if customer exists by email
      const existingCustomer = await findCustomerByEmail(customerData.email)
      
      if (existingCustomer) {
        // Update existing customer
        const result = await updateCustomer(existingCustomer.id, customerData)
        return { ...result, customerId: existingCustomer.id, isNew: false }
      } else {
        // Create new customer
        const result = await addCustomer(customerData)
        return { ...result, isNew: true }
      }
    } catch (err) {
      console.error('Error creating or updating customer:', err)
      return { success: false, error: err.message }
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    customers,
    loading,
    error,
    
    // Getters
    totalCustomers,
    customersWithBirthdays,
    upcomingBirthdays,
    
    // Actions
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    findCustomerByEmail,
    createOrUpdateCustomer,
    clearError
  }
})
