<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p class="text-gray-600">Administra todos los pedidos de Delicias Tía Jovy</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button
          @click="refreshOrders"
          :disabled="ordersStore.loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
        >
          <ArrowPathIcon :class="['h-4 w-4 mr-2', { 'animate-spin': ordersStore.loading }]" />
          Actualizar
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span class="text-yellow-600 text-lg">⏳</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pendientes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ pendingOrders.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-green-600 text-lg">📅</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Hoy</p>
            <p class="text-2xl font-semibold text-gray-900">{{ todayOrders.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-green-600 text-lg">💰</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Hoy</p>
            <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(todayTotal) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por cliente, email o teléfono..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmado</option>
            <option value="preparing">Preparando</option>
            <option value="ready">Listo</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            v-model="dateFilter"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
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
                Productos
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="ordersStore.loading">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <ArrowPathIcon class="h-5 w-5 animate-spin mr-2" />
                  Cargando pedidos...
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredOrders.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                <div class="text-4xl mb-2">📋</div>
                <p>{{ searchQuery || statusFilter || dateFilter ? 'No se encontraron pedidos con los filtros aplicados' : 'No hay pedidos registrados' }}</p>
              </td>
            </tr>
            <tr v-else v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.customerInfo.name }}</div>
                <div class="text-sm text-gray-500">{{ order.customerInfo.email }}</div>
                <div class="text-sm text-gray-500">{{ order.customerInfo.phone }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  <div v-for="item in order.items" :key="item.id" class="mb-2 last:mb-0">
                    <div class="font-medium">{{ item.name }} x{{ item.quantity }}</div>
                    <!-- Configuración de torta (si existe) -->
                    <div v-if="item.configuration" class="mt-1 text-xs text-gray-600 space-y-1">
                      <div v-if="item.configuration.size" class="flex items-center">
                        <span class="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        <span>👥 {{ item.configuration.size }} personas</span>
                      </div>
                      <div v-if="item.configuration.fillings && item.configuration.fillings.length > 0" class="flex items-start">
                        <span class="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 mt-1"></span>
                        <span>🥧 {{ item.configuration.fillings.join(', ') }}</span>
                      </div>
                      <div v-if="item.configuration.extras && item.configuration.extras.length > 0" class="flex items-start">
                        <span class="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2 mt-1"></span>
                        <span>✨ {{ item.configuration.extras.join(', ') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatCurrency(order.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  :value="order.status || 'pending'"
                  @change="updateOrderStatus(order.id, $event.target.value)"
                  :class="getStatusClass(order.status || 'pending')"
                  class="text-xs font-medium px-2.5 py-0.5 rounded-full border-0 focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">⏳ Pendiente</option>
                  <option value="confirmed">✅ Confirmado</option>
                  <option value="preparing">👩‍🍳 Preparando</option>
                  <option value="ready">🎉 Listo</option>
                  <option value="delivered">📦 Entregado</option>
                  <option value="cancelled">❌ Cancelado</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewOrder(order)"
                    class="text-primary hover:text-primary/80 transition-colors"
                    title="Ver detalles"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteOrder(order.id)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar pedido"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
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

    <!-- Order Detail Modal -->
    <OrderDetailModal
      v-if="selectedOrder"
      :order="selectedOrder"
      @close="selectedOrder = null"
      @status-updated="handleStatusUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { ArrowPathIcon, EyeIcon, TrashIcon } from '@heroicons/vue/24/outline'
import OrderDetailModal from './OrderDetailModal.vue'

const ordersStore = useOrdersStore()

// State
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const selectedOrder = ref(null)

// Computed properties
const filteredOrders = computed(() => {
  let filtered = ordersStore.orders

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.customerInfo.name.toLowerCase().includes(query) ||
      order.customerInfo.email.toLowerCase().includes(query) ||
      order.customerInfo.phone.includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(order => (order.status || 'pending') === statusFilter.value)
  }

  // Date filter
  if (dateFilter.value) {
    const filterDate = new Date(dateFilter.value).toDateString()
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createdAt.seconds * 1000).toDateString()
      return orderDate === filterDate
    })
  }

  return filtered
})

const pendingOrders = computed(() => {
  return ordersStore.orders.filter(order => !order.status || order.status === 'pending')
})

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

// Methods
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  
  let date
  if (timestamp.seconds) {
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

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || classes.pending
}

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await ordersStore.updateOrderStatus(orderId, newStatus)
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

const viewOrder = (order) => {
  selectedOrder.value = order
}

const deleteOrder = async (orderId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.')) {
    try {
      await ordersStore.deleteOrder(orderId)
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }
}

const refreshOrders = () => {
  ordersStore.fetchOrders()
}

const handleStatusUpdate = () => {
  // Refresh orders after status update
  refreshOrders()
}

onMounted(() => {
  // Fetch orders when component mounts
  ordersStore.fetchOrders()
})
</script>
