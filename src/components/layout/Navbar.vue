<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center space-x-3">
            <div class="w-12 h-12 flex items-center justify-center">
              <img src="/images/logos/logo2_fondo_t.png" alt="Delicias Tía Jovy Logo"
                class="w-full h-full object-contain" @error="handleLogoError" />
            </div>
            <div class="hidden sm:block">
              <h1 class="text-xl font-display font-bold text-gradient">
                Delicias Tía Jovy
              </h1>
              <p class="text-xs text-gray-600">Pastelería & Mini Market</p>
            </div>
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <RouterLink to="/" class="nav-link" :class="{ 'nav-link-active': $route.name === 'home' }">
              Inicio
            </RouterLink>
            <RouterLink to="/tienda" class="nav-link" :class="{ 'nav-link-active': $route.name === 'tienda' }">
              Tienda
            </RouterLink>
          </div>
        </div>

        <!-- Cart Button -->
        <div class="flex items-center space-x-4">
          <button @click="cartStore.toggleModal()"
            class="relative p-2 text-gray-600 hover:text-primary transition-colors duration-200">
            <ShoppingCartIcon class="h-6 w-6" />
            <span v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {{ cartStore.itemCount }}
            </span>
          </button>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="isMenuOpen = !isMenuOpen"
              class="p-2 text-gray-600 hover:text-primary transition-colors duration-200">
              <Bars3Icon v-if="!isMenuOpen" class="h-6 w-6" />
              <XMarkIcon v-else class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <div v-show="isMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white">
            <RouterLink to="/" @click="isMenuOpen = false" class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.name === 'home' }">
              🏠 Inicio
            </RouterLink>
            <RouterLink to="/tienda" @click="isMenuOpen = false" class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.name === 'tienda' }">
              🛒 Tienda
            </RouterLink>

            <!-- Cart info in mobile -->
            <div class="mobile-nav-link border-t border-gray-200 mt-2 pt-2">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">🛒 Carrito</span>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">{{ cartStore.itemCount }} items</span>
                  <span class="text-sm font-medium text-primary">{{ cartStore.formattedTotal }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const isMenuOpen = ref(false)

const handleLogoError = (event) => {
  // Fallback to emoji if logo fails to load
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<span class="text-2xl">🧁</span>'
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200;
}

.nav-link-active {
  @apply text-primary bg-primary/10;
}

.mobile-nav-link {
  @apply text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200;
}

.mobile-nav-link-active {
  @apply text-primary bg-primary/10;
}
</style>
