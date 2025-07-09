<template>
  <!-- Modal Overlay with Teleport -->
  <teleport to="body">
    <transition name="order-modal" appear @after-enter="focusModal" @after-leave="restoreBodyScroll">
      <div v-if="ordersStore.isOrderModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-[60] flex sm:items-center items-end justify-center p-0 sm:p-4"
        @click="handleOverlayClick" @keydown.esc="ordersStore.closeOrderModal()">
        <!-- Modal Content -->
        <div ref="modalContent"
          class="bg-white w-full h-full sm:w-auto sm:h-auto sm:max-w-md sm:max-h-[90vh] sm:rounded-xl rounded-t-xl rounded-b-none shadow-xl overflow-y-auto order-content"
          @click.stop role="dialog" aria-modal="true" aria-labelledby="order-title" aria-describedby="order-description"
          tabindex="-1">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="order-title" class="text-xl font-semibold text-gray-900">Confirmar Pedido</h2>
            <button @click="ordersStore.closeOrderModal()"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Cerrar formulario de pedido" title="Cerrar formulario de pedido">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
            <!-- Order Summary -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-medium text-gray-900 mb-3">Resumen del Pedido</h3>
              <div id="order-description" class="space-y-2">
                <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm">
                  <span>{{ item.name }} x{{ item.quantity }}</span>
                  <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
                <div class="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span class="text-primary">{{ cartStore.formattedTotal }}</span>
                </div>
              </div>
            </div>

            <!-- Customer Information -->
            <div class="space-y-4">
              <h3 class="font-medium text-gray-900 flex items-center">
                <span class="text-lg mr-2" role="img" aria-label="Usuario">👤</span>
                Información de Contacto
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input id="name" v-model="form.name" type="text" required class="input-field"
                    placeholder="Tu nombre completo" />
                </div>

                <div>
                  <label for="rut" class="block text-sm font-medium text-gray-700 mb-1">
                    RUT (opcional)
                  </label>
                  <input id="rut" v-model="form.rut" @input="formatRutInput" type="text" class="input-field"
                    placeholder="12.345.678-9" maxlength="12" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input id="email" v-model="form.email" type="email" required class="input-field"
                    placeholder="tu@email.com" />
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <div class="flex">
                    <span
                      class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +56
                    </span>
                    <input id="phone" v-model="form.phone" type="tel" required class="input-field rounded-l-none"
                      placeholder="912345678" pattern="[0-9]{9}" maxlength="9" />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Formato: 912345678 (sin espacios ni guiones)</p>
                </div>
              </div>

              <div>
                <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Cumpleaños (opcional)
                </label>
                <input id="birthDate" v-model="form.birthDate" type="date" class="input-field" />
                <p class="text-xs text-gray-500 mt-1">Para enviarte felicitaciones especiales 🎂</p>
              </div>

              <!-- Social Media (Optional) -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <span class="text-lg mr-2" role="img" aria-label="Redes sociales">📱</span>
                  Redes Sociales (opcional)
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="instagram" class="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <input id="instagram" v-model="form.instagramLink" type="url" class="input-field"
                      placeholder="https://instagram.com/tu_usuario" />
                  </div>

                  <div>
                    <label for="facebook" class="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <input id="facebook" v-model="form.facebookLink" type="url" class="input-field"
                      placeholder="https://facebook.com/tu_perfil" />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">Para mantenerte informado de nuestras promociones especiales</p>
              </div>

              <div>
                <label for="comments" class="block text-sm font-medium text-gray-700 mb-1">
                  Comentarios Adicionales
                </label>
                <textarea id="comments" v-model="form.comments" rows="3" class="input-field resize-none"
                  placeholder="Ej: sin azúcar, con relleno extra, hora de entrega preferida..."></textarea>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="ordersStore.error" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-red-600 text-sm">{{ ordersStore.error }}</p>
            </div>

            <!-- Submit Button -->
            <div class="flex space-x-3">
              <button type="button" @click="ordersStore.closeOrderModal()"
                class="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                aria-label="Cancelar pedido y cerrar formulario" title="Cancelar pedido y cerrar formulario">
                Cancelar
              </button>
              <button type="submit" :disabled="ordersStore.loading || !isFormValid"
                class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                :aria-label="ordersStore.loading ? 'Procesando pedido' : 'Confirmar pedido y enviar por WhatsApp'"
                :title="ordersStore.loading ? 'Procesando pedido' : 'Confirmar pedido y enviar por WhatsApp'">
                <span v-if="ordersStore.loading">Procesando...</span>
                <span v-else>Confirmar Pedido <span role="img" aria-label="WhatsApp">📱</span></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useProductsStore } from '@/stores/products'
import { useCustomersStore } from '@/stores/customers'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()
const customersStore = useCustomersStore()

const modalContent = ref(null)
let previousActiveElement = null

const form = ref({
  name: '',
  email: '',
  phone: '',
  rut: '',
  birthDate: '',
  instagramLink: '',
  facebookLink: '',
  comments: ''
})

const isFormValid = computed(() => {
  return form.value.name.trim() &&
    form.value.email.trim() &&
    form.value.phone.trim() &&
    form.value.phone.length === 9
})

const formatPrice = (price) => productsStore.formatPrice(price)

// RUT formatting functions
const formatRut = (rut) => {
  // Remove all non-numeric characters except 'k' or 'K'
  const cleaned = rut.replace(/[^0-9kK]/g, '')

  if (cleaned.length === 0) return ''

  // Separate the verification digit
  const body = cleaned.slice(0, -1)
  const verifier = cleaned.slice(-1).toUpperCase()

  if (body.length === 0) return verifier

  // Format the body with dots
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Return formatted RUT
  return `${formattedBody}-${verifier}`
}

const formatRutInput = (event) => {
  const input = event.target
  const cursorPosition = input.selectionStart
  const oldValue = input.value
  const newValue = formatRut(oldValue)

  // Update the form value
  form.value.rut = newValue

  // Restore cursor position (approximately)
  nextTick(() => {
    const lengthDiff = newValue.length - oldValue.length
    const newCursorPosition = Math.max(0, cursorPosition + lengthDiff)
    input.setSelectionRange(newCursorPosition, newCursorPosition)
  })
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    ordersStore.closeOrderModal()
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    rut: '',
    birthDate: '',
    instagramLink: '',
    facebookLink: '',
    comments: ''
  }
}

// Función separada para procesar el pedido
const procesarPedido = async () => {
  try {
    // Prepare customer data
    const customerData = {
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      phone: `+56${form.value.phone.trim()}`,
      rut: form.value.rut.trim() || null,
      birthDate: form.value.birthDate || null,
      instagramLink: form.value.instagramLink.trim() || null,
      facebookLink: form.value.facebookLink.trim() || null
    }

    // Create or update customer in database
    const customerResult = await customersStore.createOrUpdateCustomer(customerData)

    if (!customerResult.success) {
      console.warn('Error saving customer data:', customerResult.error)
      // Continue with order even if customer save fails
    }

    // Prepare order data
    const orderData = {
      customerInfo: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone
      },
      items: cartStore.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        configuration: item.configuration || null
      })),
      total: cartStore.totalPrice,
      comments: form.value.comments.trim(),
      customerId: customerResult.customerId || null,
      customerResult // Incluir resultado del cliente para el modal
    }

    // Save order to Firestore
    const orderResult = await ordersStore.createOrder(orderData)

    if (orderResult.success) {
      return { success: true, orderData }
    } else {
      return { success: false, error: orderResult.error }
    }
  } catch (error) {
    console.error('Error processing order:', error)
    return { success: false, error: error.message }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  const resultado = await procesarPedido()

  if (resultado.success) {
    // Guardar el pedido para el modal de éxito
    ordersStore.setLastOrder(resultado.orderData)

    // Clear cart and close modal
    cartStore.clearCart()
    ordersStore.closeOrderModal()
    resetForm()

    // Mostrar modal de éxito en lugar de alert
    ordersStore.openSuccessModal()
  } else {
    alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.')
  }
}

// Focus management
const focusModal = async () => {
  previousActiveElement = document.activeElement
  await nextTick()
  if (modalContent.value) {
    const firstInput = modalContent.value.querySelector('input, textarea, button')
    if (firstInput) {
      firstInput.focus()
    } else {
      modalContent.value.focus()
    }
  }
  lockBodyScroll()
}

const restoreBodyScroll = () => {
  unlockBodyScroll()
  if (previousActiveElement) {
    previousActiveElement.focus()
  }
}

// Body scroll lock
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
}

// Focus trap
const handleTabKey = (e) => {
  if (!modalContent.value) return

  const focusableElements = modalContent.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus()
      e.preventDefault()
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus()
      e.preventDefault()
    }
  }
}

// Keyboard event handler
const handleKeydown = (e) => {
  if (e.key === 'Tab') {
    handleTabKey(e)
  } else if (e.key === 'Escape') {
    ordersStore.closeOrderModal()
  }
}

// Setup and cleanup
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  unlockBodyScroll()
})
</script>

<style scoped>
/* Order Modal Animations */
.order-modal-enter-active,
.order-modal-leave-active {
  transition: all 0.3s ease;
}

.order-modal-enter-from,
.order-modal-leave-to {
  opacity: 0;
}

.order-modal-enter-from .order-content,
.order-modal-leave-to .order-content {
  transform: translateY(100%);
}

@media (min-width: 640px) {

  .order-modal-enter-from .order-content,
  .order-modal-leave-to .order-content {
    transform: scale(0.95) translateY(20px);
  }
}

.order-modal-enter-to .order-content,
.order-modal-leave-from .order-content {
  transform: translateY(0);
}

@media (min-width: 640px) {

  .order-modal-enter-to .order-content,
  .order-modal-leave-from .order-content {
    transform: scale(1) translateY(0);
  }
}
</style>
