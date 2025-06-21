<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-display font-bold text-gray-900">Panel de Administración</h1>
            <p class="text-gray-600">Gestiona los pedidos de Delicias Tía Jovy</p>
          </div>
          <button
            @click="handleLogout"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon class="h-4 w-4 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Firebase Test Component (temporal) -->
      <FirebaseTest />
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span class="text-primary">📋</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Pedidos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ ordersStore.orders.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span class="text-green-600">📅</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pedidos Hoy</p>
              <p class="text-2xl font-semibold text-gray-900">{{ todayOrders.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <span class="text-accent">💰</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Hoy</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(todayTotal) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900">Pedidos Recientes</h2>
            <button
              @click="refreshOrders"
              :disabled="ordersStore.loading"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              <ArrowPathIcon :class="['h-4 w-4 mr-2', { 'animate-spin': ordersStore.loading }]" />
              Actualizar
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comentarios
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="ordersStore.loading">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  Cargando pedidos...
                </td>
              </tr>
              <tr v-else-if="ordersStore.orders.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                  <div class="text-4xl mb-2">📋</div>
                  <p>No hay pedidos registrados</p>
                </td>
              </tr>
              <tr v-else v-for="order in ordersStore.orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ order.customerInfo.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{{ order.customerInfo.email }}</div>
                  <div>{{ order.customerInfo.phone }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">
                    <div v-for="item in order.items" :key="item.id" class="mb-1">
                      {{ item.name }} x{{ item.quantity }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatCurrency(order.total) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <div class="truncate" :title="order.comments">
                    {{ order.comments || '-' }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="ordersStore.error" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600 text-sm">{{ ordersStore.error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import FirebaseTest from '@/components/admin/FirebaseTest.vue'
import { ArrowRightOnRectangleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const todayOrders = computed(() => {
  const today = new Date().toDateString()
  return ordersStore.orders.filter(order => {
    const orderDate = new Date(order.createdAt.seconds * 1000).toDateString()
    return orderDate === today
  })
})

const todayTotal = computed(() => {
  return todayOrders.value.reduce((total, order) => total + order.total, 0)
})

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  
  let date
  if (timestamp.seconds) {
    // Firestore timestamp
    date = new Date(timestamp.seconds * 1000)
  } else {
    date = new Date(timestamp)
  }
  
  return date.toLocaleString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const refreshOrders = () => {
  ordersStore.fetchOrders()
}

onMounted(() => {
  // Fetch orders when component mounts
  ordersStore.fetchOrders()
})
</script>
