<template>
  <!-- Modal Overlay with Teleport -->
  <teleport to="body">
    <transition name="success-modal" appear @after-enter="focusModal">
      <div v-if="ordersStore.isSuccessModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4"
        @click="handleOverlayClick" @keydown.esc="closeModal">
        <!-- Modal Content -->
        <div ref="modalContent"
          class="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden success-content"
          @click.stop role="dialog" aria-modal="true" aria-labelledby="success-title" 
          tabindex="-1">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
            <div class="text-6xl mb-2">🎉</div>
            <h2 id="success-title" class="text-2xl font-bold text-white">
              ¡Pedido Enviado!
            </h2>
            <p class="text-green-100 mt-2">{{ customerMessage }}</p>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- Order Summary -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">Resumen de tu pedido:</h3>
              <div class="space-y-2">
                <div v-for="item in lastOrder?.items || []" :key="item.id" 
                  class="flex justify-between text-sm">
                  <span>{{ item.name }} x{{ item.quantity }}</span>
                  <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
                <div class="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span class="text-primary">{{ formatPrice(lastOrder?.total || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- iOS Alert -->
            <div v-if="isIOS" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <div class="text-amber-500 text-xl">⚠️</div>
                <div>
                  <p class="text-sm text-amber-800 font-medium">Usuarios de iPhone:</p>
                  <p class="text-sm text-amber-700 mt-1">
                    Asegúrate de presionar el botón manualmente para abrir WhatsApp correctamente.
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <!-- Primary WhatsApp Button -->
              <button @click="openWhatsApp" 
                class="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-medium transition-all duration-200 flex items-center justify-center space-x-3">
                <span class="text-2xl">📱</span>
                <span>Finalizar en WhatsApp</span>
              </button>

              <!-- Fallback Copy Button -->
              <button @click="copyToClipboard" 
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                <span class="text-lg">📋</span>
                <span>Copiar mensaje</span>
              </button>

              <!-- Close Button -->
              <button @click="closeModal" 
                class="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors duration-200">
                Cerrar (sin enviar)
              </button>
            </div>

            <!-- Help Text -->
            <div class="text-center text-xs text-gray-500 space-y-1">
              <p>¿No se abrió WhatsApp? Puedes copiar el mensaje y enviarlo manualmente.</p>
              <p>O contactarnos directamente al <strong>+56984630545</strong></p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useProductsStore } from '@/stores/products'

const ordersStore = useOrdersStore()
const productsStore = useProductsStore()

const modalContent = ref(null)
const whatsappOpened = ref(false)
let previousActiveElement = null
let whatsappTimeout = null

// Computed properties
const lastOrder = computed(() => ordersStore.lastOrder)
const customerMessage = computed(() => {
  if (!lastOrder.value?.customerResult) return '¡Gracias por tu pedido!'
  return lastOrder.value.customerResult.isNew 
    ? '¡Bienvenido a nuestra familia de clientes!' 
    : '¡Gracias por volver!'
})

const whatsappUrl = computed(() => {
  if (!lastOrder.value) return ''
  const message = ordersStore.generateWhatsAppMessage(lastOrder.value)
  return `https://wa.me/56984630545?text=${message}`
})

// Device detection
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

// Methods
const formatPrice = (price) => productsStore.formatPrice(price)

const openWhatsApp = () => {
  if (!whatsappUrl.value) return
  
  whatsappOpened.value = true
  
  // Use window.location.href for better iOS compatibility
  window.location.href = whatsappUrl.value
  
  // Set timeout to show fallback message if WhatsApp doesn't open
  whatsappTimeout = setTimeout(() => {
    if (!document.hidden) {
      alert('¿No se abrió WhatsApp? Puedes intentarlo nuevamente o copiar el mensaje manualmente.')
    }
  }, 7000)
  
  // Close modal after a short delay
  setTimeout(() => {
    closeModal()
  }, 2000)
}

const copyToClipboard = async () => {
  if (!whatsappUrl.value) return
  
  try {
    const message = decodeURIComponent(whatsappUrl.value.split('text=')[1])
    
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(message)
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = message
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }
    
    alert('Mensaje copiado al portapapeles. Ahora puedes pegarlo en WhatsApp manualmente.')
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    alert('No se pudo copiar automáticamente. Por favor, copia el mensaje manualmente desde WhatsApp.')
  }
}

const closeModal = () => {
  if (whatsappTimeout) {
    clearTimeout(whatsappTimeout)
    whatsappTimeout = null
  }
  ordersStore.closeSuccessModal()
  restoreFocus()
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// Focus management
const focusModal = async () => {
  previousActiveElement = document.activeElement
  await nextTick()
  if (modalContent.value) {
    modalContent.value.focus()
  }
}

const restoreFocus = () => {
  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  if (whatsappTimeout) {
    clearTimeout(whatsappTimeout)
  }
})

const handleVisibilityChange = () => {
  // If user comes back to the page and WhatsApp was opened, assume it worked
  if (document.hidden === false && whatsappOpened.value && whatsappTimeout) {
    clearTimeout(whatsappTimeout)
    whatsappTimeout = null
  }
}
</script>

<style scoped>
/* Modal animations */
.success-modal-enter-active,
.success-modal-leave-active {
  transition: all 0.3s ease;
}

.success-modal-enter-from,
.success-modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.success-content {
  animation: modalBounce 0.4s ease-out;
}

@keyframes modalBounce {
  0% {
    transform: scale(0.8) translateY(-20px);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) translateY(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .success-content {
    margin: 1rem;
    max-height: 90vh;
    overflow-y: auto;
  }
}
</style>
