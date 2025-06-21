<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="hidden md:flex md:w-64 md:flex-col">
      <div class="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
        <!-- Logo -->
        <div class="flex items-center flex-shrink-0 px-4" style="padding-left: clamp(1rem, 3vw, 1.5rem); padding-right: clamp(1rem, 3vw, 1.5rem);">
          <div class="flex items-center">
            <span class="text-2xl">🧁</span>
            <div class="ml-3">
              <h1 class="text-lg font-semibold text-gray-900">Admin Panel</h1>
              <p class="text-sm text-gray-500">Delicias Tía Jovy</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="mt-8 flex-1 px-2 space-y-1" style="padding-left: clamp(0.5rem, 2vw, 1rem); padding-right: clamp(0.5rem, 2vw, 1rem);">
          <template v-for="item in navigation" :key="item.id">
            <button
              @click="$emit('navigate', item.id)"
              :class="[
                item.id === activeSection
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200'"
              style="font-size: clamp(0.875rem, 2vw, 1rem); padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.5rem, 1.5vw, 0.75rem); min-height: 2.5rem;"
              ]"
            >
              <span class="text-lg mr-3">{{ item.icon }}</span>
              {{ item.name }}
              <span v-if="item.badge" class="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                {{ item.badge }}
              </span>
            </button>
          </template>
        </nav>

        <!-- User Section -->
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">{{ userInitials }}</span>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">{{ userEmail }}</p>
              <button
                @click="$emit('logout')"
                class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile sidebar overlay -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 flex z-40 md:hidden">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="$emit('toggle-mobile')"></div>
      <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button
            @click="$emit('toggle-mobile')"
            class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="sr-only">Cerrar sidebar</span>
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Mobile navigation content (same as desktop) -->
        <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div class="flex-shrink-0 flex items-center px-4">
            <span class="text-2xl">🧁</span>
            <div class="ml-3">
              <h1 class="text-lg font-semibold text-gray-900">Admin Panel</h1>
              <p class="text-sm text-gray-500">Delicias Tía Jovy</p>
            </div>
          </div>
          <nav class="mt-5 px-2 space-y-1">
            <template v-for="item in navigation" :key="item.id">
              <button
                @click="$emit('navigate', item.id); $emit('toggle-mobile')"
                :class="[
                  item.id === activeSection
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left'
                ]"
              >
                <span class="text-lg mr-3">{{ item.icon }}</span>
                {{ item.name }}
                <span v-if="item.badge" class="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {{ item.badge }}
                </span>
              </button>
            </template>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <!-- Mobile header -->
      <div class="md:hidden">
        <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            @click="$emit('toggle-mobile')"
            class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
          >
            <span class="sr-only">Abrir sidebar</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <div class="flex-1 px-4 flex justify-between">
            <div class="flex-1 flex">
              <div class="w-full flex md:ml-0">
                <div class="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div class="flex items-center h-16">
                    <span class="text-lg font-semibold text-gray-900">{{ currentSectionName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content area -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeSection: {
    type: String,
    default: 'dashboard'
  },
  mobileMenuOpen: {
    type: Boolean,
    default: false
  },
  userEmail: {
    type: String,
    default: 'admin@deliciastiajovy.com'
  },
  pendingOrders: {
    type: Number,
    default: 0
  }
})

defineEmits(['navigate', 'logout', 'toggle-mobile'])

const navigation = computed(() => [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '📊'
  },
  {
    id: 'orders',
    name: 'Gestión de Pedidos',
    icon: '📋',
    badge: props.pendingOrders > 0 ? props.pendingOrders : null
  },
  {
    id: 'products',
    name: 'Gestión de Productos',
    icon: '🧁'
  },
  {
    id: 'customers',
    name: 'Gestión de Clientes',
    icon: '👥'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📈'
  }
])

const currentSectionName = computed(() => {
  const section = navigation.value.find(item => item.id === props.activeSection)
  return section ? section.name : 'Dashboard'
})

const userInitials = computed(() => {
  return props.userEmail
    .split('@')[0]
    .split('.')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
})
</script>
