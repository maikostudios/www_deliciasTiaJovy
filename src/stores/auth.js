import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/main.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  async function login(email, password) {
    try {
      loading.value = true
      error.value = null
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      user.value = null
      error.value = null
    } catch (err) {
      error.value = err.message
    }
  }

  function clearError() {
    error.value = null
  }

  // Initialize auth state listener
  function initializeAuth() {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    // Actions
    login,
    logout,
    clearError,
    initializeAuth
  }
})
