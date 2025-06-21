<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="$emit('close')">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Detalles del Pedido #{{ order.id.slice(-6).toUpperCase() }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="mt-4 max-h-96 overflow-y-auto">
        <!-- Order Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Customer Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              <span class="text-lg mr-2">👤</span>
              Información del Cliente
            </h4>
            <div class="space-y-2 text-sm">
              <div>
                <span class="font-medium text-gray-700">Nombre:</span>
                <span class="ml-2 text-gray-900">{{ order.customerInfo.name }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Email:</span>
                <span class="ml-2 text-gray-900">{{ order.customerInfo.email }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Teléfono:</span>
                <span class="ml-2 text-gray-900">{{ order.customerInfo.phone }}</span>
              </div>
            </div>
          </div>

          <!-- Order Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              <span class="text-lg mr-2">📋</span>
              Información del Pedido
            </h4>
            <div class="space-y-2 text-sm">
              <div>
                <span class="font-medium text-gray-700">Fecha:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Estado:</span>
                <span class="ml-2">
                  <select
                    :value="currentStatus"
                    @change="updateStatus($event.target.value)"
                    :class="getStatusClass(currentStatus)"
                    class="text-xs font-medium px-2.5 py-0.5 rounded-full border-0 focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">⏳ Pendiente</option>
                    <option value="confirmed">✅ Confirmado</option>
                    <option value="preparing">👩‍🍳 Preparando</option>
                    <option value="ready">🎉 Listo</option>
                    <option value="delivered">📦 Entregado</option>
                    <option value="cancelled">❌ Cancelado</option>
                  </select>
                </span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Total:</span>
                <span class="ml-2 text-gray-900 font-semibold">{{ formatCurrency(order.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Products -->
        <div class="mb-6">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
            <span class="text-lg mr-2">🧁</span>
            Productos ({{ order.items.length }})
          </h4>
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.id" class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h5 class="font-medium text-gray-900">{{ item.name }}</h5>
                  <p class="text-sm text-gray-600">Cantidad: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</p>
                  <p class="text-sm text-gray-600">{{ formatCurrency(item.price) }} c/u</p>
                </div>
              </div>

              <!-- Configuración de torta (si existe) -->
              <div v-if="item.configuration" class="mt-3 p-3 bg-gray-50 rounded-lg">
                <h6 class="text-sm font-medium text-gray-700 mb-2">Configuración:</h6>
                <div class="space-y-2 text-sm">
                  <div v-if="item.configuration.size" class="flex items-center">
                    <span class="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    <span class="font-medium text-gray-600">Tamaño:</span>
                    <span class="ml-2 text-gray-900">👥 {{ item.configuration.size }} personas</span>
                  </div>
                  <!-- Relleno único (nuevo formato) -->
                  <div v-if="item.configuration.filling" class="flex items-start">
                    <span class="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 mt-1"></span>
                    <span class="font-medium text-gray-600">Relleno:</span>
                    <span class="ml-2 text-gray-900">🥧 {{ getFillingDisplayName(item.configuration.filling) }}</span>
                  </div>
                  <!-- Rellenos múltiples (formato anterior - compatibilidad) -->
                  <div v-else-if="item.configuration.fillings && item.configuration.fillings.length > 0" class="flex items-start">
                    <span class="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 mt-1"></span>
                    <span class="font-medium text-gray-600">Rellenos:</span>
                    <span class="ml-2 text-gray-900">🥧 {{ item.configuration.fillings.join(', ') }}</span>
                  </div>
                  <div v-if="item.configuration.extras && item.configuration.extras.length > 0" class="flex items-start">
                    <span class="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2 mt-1"></span>
                    <span class="font-medium text-gray-600">Extras:</span>
                    <span class="ml-2 text-gray-900">✨ {{ item.configuration.extras.map(extra => getExtraDisplayName(extra)).join(', ') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div v-if="order.comments" class="mb-6">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
            <span class="text-lg mr-2">💬</span>
            Comentarios
          </h4>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-gray-900">{{ order.comments }}</p>
          </div>
        </div>

        <!-- WhatsApp Actions -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
            <span class="text-lg mr-2">📱</span>
            Acciones de WhatsApp
          </h4>
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="sendWhatsAppMessage('confirmation')"
              class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span class="mr-2">✅</span>
              Confirmar Pedido
            </button>
            <button
              @click="sendWhatsAppMessage('ready')"
              class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span class="mr-2">🎉</span>
              Notificar Listo
            </button>
            <button
              @click="sendWhatsAppMessage('custom')"
              class="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span class="mr-2">💬</span>
              Mensaje Personalizado
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cerrar
        </button>
        <button
          @click="printOrder"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          🖨️ Imprimir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useOrdersStore } from '@/stores/orders'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'status-updated'])

const ordersStore = useOrdersStore()
const currentStatus = ref(props.order.status || 'pending')

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

// Función para mostrar nombres legibles de rellenos
const getFillingDisplayName = (fillingId) => {
  const fillings = {
    'pina-crema-pina': 'Piña con crema de piña',
    'pina-crema-manjar': 'Piña con crema de manjar',
    'pina-crema-durazno': 'Piña con crema de durazno',
    'pina-crema-frutilla': 'Piña con crema de frutilla',
    'durazno-crema-durazno': 'Durazno con crema de durazno',
    'durazno-crema-manjar': 'Durazno con crema de manjar',
    'durazno-crema-frutilla': 'Durazno con crema de frutilla',
    'moca-tradicional': 'Moca tradicional pura crema',
    'moca-durazno-manjar': 'Moca con durazno y manjar',
    'frutilla-crema-frutilla': 'Frutilla con crema de frutilla',
    'frutilla-crema-manjar': 'Frutilla con crema de manjar',
    'selva-negra': 'Selva negra mermelada de ciruela crema manjar',
    'frambuesa-crema-manjar': 'Frambuesa con crema de manjar',
    'frambuesa-crema-frambuesa': 'Frambuesa con crema de frambuesa'
  }
  return fillings[fillingId] || fillingId
}

// Función para mostrar nombres legibles de extras
const getExtraDisplayName = (extraId) => {
  const extras = {
    'lamina-comestible': 'Lámina comestible personalizada',
    'topper': 'Topper personalizado',
    'tercer-relleno': 'Tercer relleno adicional',
    'nueces': 'Agregado de nueces'
  }
  return extras[extraId] || extraId
}

const updateStatus = async (newStatus) => {
  try {
    await ordersStore.updateOrderStatus(props.order.id, newStatus)
    currentStatus.value = newStatus
    emit('status-updated')
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

const sendWhatsAppMessage = (type) => {
  const phone = props.order.customerInfo.phone.replace(/\D/g, '')
  let message = ''

  switch (type) {
    case 'confirmation':
      message = `¡Hola ${props.order.customerInfo.name}! 🧁\n\nTu pedido #${props.order.id.slice(-6).toUpperCase()} ha sido confirmado.\n\nTotal: ${formatCurrency(props.order.total)}\n\nTe contactaremos pronto para coordinar la entrega.\n\n¡Gracias por elegir Delicias Tía Jovy! ❤️`
      break
    case 'ready':
      message = `¡Hola ${props.order.customerInfo.name}! 🎉\n\nTu pedido #${props.order.id.slice(-6).toUpperCase()} está listo para retirar.\n\nPuedes pasar a buscarlo cuando gustes.\n\n¡Gracias por tu preferencia! 🧁`
      break
    case 'custom':
      message = `¡Hola ${props.order.customerInfo.name}! 🧁\n\nRespecto a tu pedido #${props.order.id.slice(-6).toUpperCase()}:\n\n`
      break
  }

  const whatsappUrl = `https://wa.me/56${phone}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

const printOrder = () => {
  // Create a printable version of the order
  const printContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="text-align: center; color: #e91e63;">Delicias Tía Jovy</h1>
      <h2 style="text-align: center;">Pedido #${props.order.id.slice(-6).toUpperCase()}</h2>
      
      <div style="margin: 20px 0;">
        <h3>Cliente:</h3>
        <p><strong>Nombre:</strong> ${props.order.customerInfo.name}</p>
        <p><strong>Email:</strong> ${props.order.customerInfo.email}</p>
        <p><strong>Teléfono:</strong> ${props.order.customerInfo.phone}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3>Productos:</h3>
        ${props.order.items.map(item => `
          <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p><strong>${item.name}</strong> x${item.quantity} - ${formatCurrency(item.price * item.quantity)}</p>
            ${item.configuration ? `
              <div style="margin-left: 20px; font-size: 0.9em; color: #666;">
                ${item.configuration.size ? `<p>👥 ${item.configuration.size} personas</p>` : ''}
                ${item.configuration.filling ? `<p>🥧 ${getFillingDisplayName(item.configuration.filling)}</p>` : ''}
                ${item.configuration.fillings?.length ? `<p>🥧 ${item.configuration.fillings.join(', ')}</p>` : ''}
                ${item.configuration.extras?.length ? `<p>✨ ${item.configuration.extras.map(extra => getExtraDisplayName(extra)).join(', ')}</p>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      
      <div style="margin: 20px 0;">
        <h3>Total: ${formatCurrency(props.order.total)}</h3>
        <p><strong>Fecha:</strong> ${formatDate(props.order.createdAt)}</p>
        <p><strong>Estado:</strong> ${currentStatus.value}</p>
      </div>
      
      ${props.order.comments ? `
        <div style="margin: 20px 0;">
          <h3>Comentarios:</h3>
          <p>${props.order.comments}</p>
        </div>
      ` : ''}
    </div>
  `

  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pedido #${props.order.id.slice(-6).toUpperCase()}</title>
        <style>
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
}
</script>
