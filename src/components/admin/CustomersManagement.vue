<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p class="text-gray-600">Base de datos de clientes para campañas de marketing</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Nuevo Cliente
        </button>
        <button
          @click="refreshCustomers"
          :disabled="customersStore.loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
        >
          <ArrowPathIcon :class="['h-4 w-4 mr-2', { 'animate-spin': customersStore.loading }]" />
          Actualizar
        </button>
        <button
          @click="exportCustomers"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
          Exportar
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-blue-600 text-lg">👥</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Clientes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ customersStore.totalCustomers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <span class="text-pink-600 text-lg">🎂</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Cumpleaños Hoy</p>
            <p class="text-2xl font-semibold text-gray-900">{{ customersStore.customersWithBirthdays.length }}</p>
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
            <p class="text-sm font-medium text-gray-600">Próximos Cumpleaños</p>
            <p class="text-2xl font-semibold text-gray-900">{{ customersStore.upcomingBirthdays.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-purple-600 text-lg">📱</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Con Redes Sociales</p>
            <p class="text-2xl font-semibold text-gray-900">{{ customersWithSocialMedia.length }}</p>
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
            placeholder="Buscar por nombre, email, teléfono o RUT..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cumpleaños</label>
          <select
            v-model="birthdayFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="today">Hoy</option>
            <option value="this-week">Esta semana</option>
            <option value="this-month">Este mes</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Redes Sociales</label>
          <select
            v-model="socialMediaFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="with-social">Con redes sociales</option>
            <option value="without-social">Sin redes sociales</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RUT
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cumpleaños
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Redes Sociales
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="customersStore.loading">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <ArrowPathIcon class="h-5 w-5 animate-spin mr-2" />
                  Cargando clientes...
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredCustomers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                <div class="text-4xl mb-2">👥</div>
                <p>{{ searchQuery || birthdayFilter || socialMediaFilter ? 'No se encontraron clientes con los filtros aplicados' : 'No hay clientes registrados' }}</p>
                <button
                  v-if="!searchQuery && !birthdayFilter && !socialMediaFilter"
                  @click="showCreateModal = true"
                  class="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Agregar primer cliente
                </button>
              </td>
            </tr>
            <tr v-else v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <span class="text-white text-sm font-medium">
                        {{ getInitials(customer.name) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                    <div class="text-sm text-gray-500">
                      Cliente desde {{ formatDate(customer.createdAt, 'short') }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ customer.email }}</div>
                <div class="text-sm text-gray-500">{{ customer.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ customer.rut || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="customer.birthDate" class="text-sm text-gray-900">
                  {{ formatBirthday(customer.birthDate) }}
                  <span v-if="isBirthdayToday(customer.birthDate)" class="ml-2 text-pink-600">🎂</span>
                  <span v-else-if="isBirthdayThisWeek(customer.birthDate)" class="ml-2 text-yellow-600">📅</span>
                </div>
                <div v-else class="text-sm text-gray-500">-</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-2">
                  <a
                    v-if="customer.instagramLink"
                    :href="customer.instagramLink"
                    target="_blank"
                    class="text-pink-600 hover:text-pink-800 transition-colors"
                    title="Instagram"
                  >
                    📷
                  </a>
                  <a
                    v-if="customer.facebookLink"
                    :href="customer.facebookLink"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Facebook"
                  >
                    📘
                  </a>
                  <span v-if="!customer.instagramLink && !customer.facebookLink" class="text-gray-400">-</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewCustomer(customer)"
                    class="text-primary hover:text-primary/80 transition-colors"
                    title="Ver detalles"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="editCustomer(customer)"
                    class="text-gray-600 hover:text-gray-800 transition-colors"
                    title="Editar"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="sendBirthdayMessage(customer)"
                    v-if="isBirthdayToday(customer.birthDate)"
                    class="text-pink-600 hover:text-pink-800 transition-colors"
                    title="Enviar felicitación"
                  >
                    🎂
                  </button>
                  <button
                    @click="deleteCustomer(customer.id)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar"
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
    <div v-if="customersStore.error" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600 text-sm">{{ customersStore.error }}</p>
    </div>

    <!-- Customer Form Modal -->
    <!-- TODO: Implementar CustomerFormModal -->
    <div v-if="showCreateModal || editingCustomer" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>
        <p class="text-gray-600 mb-4">Funcionalidad en desarrollo...</p>
        <button @click="closeModal" class="px-4 py-2 bg-primary text-white rounded-lg">Cerrar</button>
      </div>
    </div>

    <!-- Customer Detail Modal -->
    <!-- TODO: Implementar CustomerDetailModal -->
    <div v-if="selectedCustomer" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Detalles del Cliente</h3>
        <p class="text-gray-600 mb-4">{{ selectedCustomer.name }}</p>
        <button @click="selectedCustomer = null" class="px-4 py-2 bg-primary text-white rounded-lg">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCustomersStore } from '@/stores/customers'
import { 
  PlusIcon, 
  ArrowPathIcon, 
  ArrowDownTrayIcon,
  EyeIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'
// import CustomerFormModal from './CustomerFormModal.vue'
// import CustomerDetailModal from './CustomerDetailModal.vue'

const customersStore = useCustomersStore()

// State
const searchQuery = ref('')
const birthdayFilter = ref('')
const socialMediaFilter = ref('')
const showCreateModal = ref(false)
const editingCustomer = ref(null)
const selectedCustomer = ref(null)

// Computed properties
const filteredCustomers = computed(() => {
  let filtered = customersStore.customers

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      (customer.rut && customer.rut.toLowerCase().includes(query))
    )
  }

  // Birthday filter
  if (birthdayFilter.value) {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()
    
    filtered = filtered.filter(customer => {
      if (!customer.birthDate) return false
      const birthDate = new Date(customer.birthDate)
      
      switch (birthdayFilter.value) {
        case 'today':
          return birthDate.getMonth() === currentMonth && birthDate.getDate() === currentDay
        case 'this-week':
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
          return thisYearBirthday >= today && thisYearBirthday <= nextWeek
        case 'this-month':
          return birthDate.getMonth() === currentMonth
        default:
          return true
      }
    })
  }

  // Social media filter
  if (socialMediaFilter.value) {
    if (socialMediaFilter.value === 'with-social') {
      filtered = filtered.filter(customer => customer.instagramLink || customer.facebookLink)
    } else if (socialMediaFilter.value === 'without-social') {
      filtered = filtered.filter(customer => !customer.instagramLink && !customer.facebookLink)
    }
  }

  return filtered
})

const customersWithSocialMedia = computed(() => {
  return customersStore.customers.filter(customer => customer.instagramLink || customer.facebookLink)
})

// Methods
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

const formatDate = (date, format = 'full') => {
  if (!date) return '-'
  
  const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date)
  
  if (format === 'short') {
    return d.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })
  }
  
  return d.toLocaleDateString('es-CL')
}

const formatBirthday = (birthDate) => {
  if (!birthDate) return '-'
  const date = new Date(birthDate)
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long'
  })
}

const isBirthdayToday = (birthDate) => {
  if (!birthDate) return false
  const today = new Date()
  const birth = new Date(birthDate)
  return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate()
}

const isBirthdayThisWeek = (birthDate) => {
  if (!birthDate) return false
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const birth = new Date(birthDate)
  const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  
  return thisYearBirthday >= today && thisYearBirthday <= nextWeek && !isBirthdayToday(birthDate)
}

const viewCustomer = (customer) => {
  selectedCustomer.value = customer
}

const editCustomer = (customer) => {
  editingCustomer.value = { ...customer }
  selectedCustomer.value = null
}

const deleteCustomer = async (customerId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.')) {
    try {
      await customersStore.deleteCustomer(customerId)
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }
}

const sendBirthdayMessage = (customer) => {
  const phone = customer.phone.replace(/\D/g, '')
  const message = `¡Feliz cumpleaños ${customer.name}! 🎂🎉\n\nEn Delicias Tía Jovy queremos desearte un día lleno de alegría y dulzura.\n\n¡Que tengas un cumpleaños delicioso! 🧁❤️`
  
  const whatsappUrl = `https://wa.me/56${phone}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

const exportCustomers = () => {
  // Create CSV content
  const headers = ['Nombre', 'Email', 'Teléfono', 'RUT', 'Cumpleaños', 'Instagram', 'Facebook', 'Fecha Registro']
  const csvContent = [
    headers.join(','),
    ...customersStore.customers.map(customer => [
      `"${customer.name}"`,
      `"${customer.email}"`,
      `"${customer.phone}"`,
      `"${customer.rut || ''}"`,
      `"${customer.birthDate ? formatBirthday(customer.birthDate) : ''}"`,
      `"${customer.instagramLink || ''}"`,
      `"${customer.facebookLink || ''}"`,
      `"${formatDate(customer.createdAt)}"`
    ].join(','))
  ].join('\n')

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `clientes-delicias-tia-jovy-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const refreshCustomers = () => {
  customersStore.fetchCustomers()
}

const closeModal = () => {
  showCreateModal.value = false
  editingCustomer.value = null
}

const handleCustomerSaved = () => {
  closeModal()
  refreshCustomers()
}

onMounted(() => {
  // Load customers when component mounts
  customersStore.fetchCustomers()
})
</script>
