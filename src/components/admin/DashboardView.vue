<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600">Resumen general de Delicias Tía Jovy</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Pedidos -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-blue-600 text-lg">📋</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Pedidos</p>
            <p class="text-2xl font-semibold text-gray-900">{{ ordersStore.orders.length }}</p>
          </div>
        </div>
      </div>

      <!-- Pedidos Hoy -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-green-600 text-lg">📅</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pedidos Hoy</p>
            <p class="text-2xl font-semibold text-gray-900">{{ todayOrders.length }}</p>
          </div>
        </div>
      </div>

      <!-- Total Productos -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-purple-600 text-lg">🧁</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Productos</p>
            <p class="text-2xl font-semibold text-gray-900">{{ productsStore.products.length }}</p>
          </div>
        </div>
      </div>

      <!-- Total Clientes -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <span class="text-pink-600 text-lg">👥</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Clientes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ customersStore.totalCustomers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Pedidos Recientes -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Pedidos Recientes</h3>
        </div>
        <div class="p-6">
          <div v-if="ordersStore.loading" class="text-center text-gray-500">
            Cargando pedidos...
          </div>
          <div v-else-if="recentOrders.length === 0" class="text-center text-gray-500">
            <div class="text-4xl mb-2">📋</div>
            <p>No hay pedidos recientes</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">{{ order.customerInfo.name }}</p>
                <p class="text-sm text-gray-600">{{ formatCurrency(order.total) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pendiente
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cumpleaños -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Cumpleaños</h3>
        </div>
        <div class="p-6">
          <div v-if="customersStore.loading" class="text-center text-gray-500">
            Cargando clientes...
          </div>
          <div v-else-if="customersStore.upcomingBirthdays.length === 0" class="text-center text-gray-500">
            <div class="text-4xl mb-2">🎂</div>
            <p>No hay cumpleaños próximos</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="customer in customersStore.upcomingBirthdays" :key="customer.id" class="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">{{ customer.name }}</p>
                <p class="text-sm text-gray-600">{{ customer.email }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-pink-600 font-medium">{{ formatBirthday(customer.birthDate) }}</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  🎂 Cumpleaños
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ventas del Mes -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Resumen del Mes</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(monthlyTotal) }}</p>
            <p class="text-sm text-gray-600">Ventas del Mes</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-blue-600">{{ monthlyOrders.length }}</p>
            <p class="text-sm text-gray-600">Pedidos del Mes</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-purple-600">{{ averageOrderValue }}</p>
            <p class="text-sm text-gray-600">Promedio por Pedido</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones de Desarrollo -->
    <div v-if="showDevActions" class="bg-yellow-50 border border-yellow-200 rounded-lg shadow">
      <div class="px-6 py-4 border-b border-yellow-200">
        <h3 class="text-lg font-medium text-yellow-900">🛠️ Herramientas de Desarrollo</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            @click="initializeSampleData"
            :disabled="initializingData"
            class="inline-flex items-center justify-center px-4 py-2 border border-yellow-300 rounded-lg text-yellow-800 bg-yellow-100 hover:bg-yellow-200 transition-colors disabled:opacity-50"
          >
            <span v-if="initializingData">⏳ Inicializando...</span>
            <span v-else>📦 Cargar Datos de Muestra</span>
          </button>

          <button
            @click="checkProductsCount"
            class="inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-lg text-blue-800 bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            📊 Verificar Productos ({{ productsStore.products.length }})
          </button>

          <button
            @click="refreshAllData"
            :disabled="refreshingData"
            class="inline-flex items-center justify-center px-4 py-2 border border-green-300 rounded-lg text-green-800 bg-green-100 hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            <span v-if="refreshingData">🔄 Actualizando...</span>
            <span v-else">🔄 Actualizar Todo</span>
          </button>
        </div>

        <div v-if="devMessage" class="mt-4 p-3 rounded-lg" :class="devMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ devMessage.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useProductsStore } from '@/stores/products'
import { useCustomersStore } from '@/stores/customers'
import { initializeSampleData as initSampleData, checkProductsExist } from '@/utils/init-sample-data.js'

const ordersStore = useOrdersStore()
const productsStore = useProductsStore()
const customersStore = useCustomersStore()

// Development actions state
const showDevActions = ref(true) // Show in development
const initializingData = ref(false)
const refreshingData = ref(false)
const devMessage = ref(null)

// Computed properties
const todayOrders = computed(() => {
  const today = new Date().toDateString()
  return ordersStore.orders.filter(order => {
    const orderDate = new Date(order.createdAt.seconds * 1000).toDateString()
    return orderDate === today
  })
})

const recentOrders = computed(() => {
  return ordersStore.orders.slice(0, 5)
})

const monthlyOrders = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return ordersStore.orders.filter(order => {
    const orderDate = new Date(order.createdAt.seconds * 1000)
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
  })
})

const monthlyTotal = computed(() => {
  return monthlyOrders.value.reduce((total, order) => total + order.total, 0)
})

const averageOrderValue = computed(() => {
  if (monthlyOrders.value.length === 0) return '$0'
  const average = monthlyTotal.value / monthlyOrders.value.length
  return formatCurrency(average)
})

// Methods
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  
  let date
  if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000)
  } else {
    date = new Date(timestamp)
  }
  
  return date.toLocaleDateString('es-CL', {
    month: 'short',
    day: 'numeric',
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

const formatBirthday = (birthDate) => {
  if (!birthDate) return '-'
  const date = new Date(birthDate)
  return date.toLocaleDateString('es-CL', {
    month: 'short',
    day: 'numeric'
  })
}

// Development actions
const initializeSampleData = async () => {
  try {
    initializingData.value = true
    devMessage.value = null

    const result = await initSampleData()

    if (result.success) {
      devMessage.value = {
        type: 'success',
        text: `✅ ${result.message}`
      }

      // Refresh products store
      await productsStore.fetchProducts()
    } else {
      devMessage.value = {
        type: 'error',
        text: `❌ Error: ${result.error}`
      }
    }
  } catch (error) {
    devMessage.value = {
      type: 'error',
      text: `❌ Error: ${error.message}`
    }
  } finally {
    initializingData.value = false

    // Clear message after 5 seconds
    setTimeout(() => {
      devMessage.value = null
    }, 5000)
  }
}

const checkProductsCount = async () => {
  try {
    const result = await checkProductsExist()

    if (result.success) {
      devMessage.value = {
        type: 'success',
        text: `📊 Productos en Firebase: ${result.count}`
      }
    } else {
      devMessage.value = {
        type: 'error',
        text: `❌ Error verificando productos: ${result.error}`
      }
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      devMessage.value = null
    }, 3000)
  } catch (error) {
    devMessage.value = {
      type: 'error',
      text: `❌ Error: ${error.message}`
    }
  }
}

const refreshAllData = async () => {
  try {
    refreshingData.value = true
    devMessage.value = null

    await Promise.all([
      ordersStore.fetchOrders(),
      productsStore.fetchProducts(),
      customersStore.fetchCustomers()
    ])

    devMessage.value = {
      type: 'success',
      text: '🔄 Todos los datos actualizados'
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      devMessage.value = null
    }, 3000)
  } catch (error) {
    devMessage.value = {
      type: 'error',
      text: `❌ Error actualizando: ${error.message}`
    }
  } finally {
    refreshingData.value = false
  }
}

onMounted(async () => {
  // Load data for dashboard
  await Promise.all([
    ordersStore.fetchOrders(),
    productsStore.fetchProducts(),
    customersStore.fetchCustomers()
  ])
})
</script>
