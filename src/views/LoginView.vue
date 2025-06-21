<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="flex justify-center">
        <div class="w-20 h-20 bg-white rounded-xl shadow-lg p-3 flex items-center justify-center">
          <img
            src="/images/logos/logo2_fondo_t.png"
            alt="Delicias Tía Jovy Logo"
            class="w-full h-full object-contain"
            @error="handleLogoError"
          />
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-display font-bold text-gray-900">
        Panel de Administración
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Acceso solo para administradores
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="input-field"
                placeholder="admin@deliciastiajovy.cl"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="input-field pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm">{{ authStore.error }}</p>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="authStore.loading || !isFormValid"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="authStore.loading">Iniciando sesión...</span>
              <span v-else>Iniciar Sesión</span>
            </button>
          </div>
        </form>

        <!-- Back to Home -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">o</span>
            </div>
          </div>

          <div class="mt-6">
            <RouterLink
              to="/"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Volver al Inicio
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)

const isFormValid = computed(() => {
  return form.value.email.trim() && form.value.password.trim()
})

const handleLogin = async () => {
  if (!isFormValid.value) return

  authStore.clearError()

  const result = await authStore.login(form.value.email, form.value.password)

  if (result.success) {
    router.push('/admin')
  }
}

const handleLogoError = (event) => {
  // Fallback to emoji if logo fails to load
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<span class="text-primary text-3xl">🧁</span>'
}

onMounted(() => {
  // Clear any previous errors
  authStore.clearError()
  
  // If already authenticated, redirect to admin
  if (authStore.isAuthenticated) {
    router.push('/admin')
  }
})
</script>
