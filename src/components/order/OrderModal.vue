<template>
  <!-- Modal Overlay -->
  <div
    v-if="ordersStore.isOrderModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    @click="handleOverlayClick"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:w-auto sm:min-w-[28rem] sm:max-w-[32rem] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto flex flex-col"
      @click.stop
      style="padding-bottom: env(safe-area-inset-bottom);"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gray-50 rounded-t-2xl sm:rounded-t-2xl">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Confirmar Pedido</h2>
        <button
          @click="ordersStore.closeOrderModal()"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 touch-manipulation rounded-full hover:bg-gray-200"
          aria-label="Cerrar modal"
        >
          <XMarkIcon class="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
        <!-- Order Summary -->
        <div class="bg-gray-50 rounded-lg p-4 sm:p-5">
          <h3 class="font-medium text-gray-900 mb-3 text-base sm:text-lg">Resumen del Pedido</h3>
          <div class="space-y-2">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex justify-between text-sm sm:text-base"
            >
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
            <div class="border-t border-gray-200 pt-2 flex justify-between font-semibold text-base sm:text-lg">
              <span>Total:</span>
              <span class="text-primary">{{ cartStore.formattedTotal }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-900 flex items-center text-base sm:text-lg">
            <span class="text-lg sm:text-xl mr-2">👤</span>
            Información de Contacto
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="input-field"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label for="rut" class="block text-sm font-medium text-gray-700 mb-1">
                RUT (opcional)
              </label>
              <input
                id="rut"
                v-model="form.rut"
                type="text"
                class="input-field"
                placeholder="12.345.678-9"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="input-field"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <div class="flex">
                <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm" style="font-size: clamp(0.875rem, 2vw, 1rem); padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);">
                  +56
                </span>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  required
                  class="input-field rounded-l-none"
                  placeholder="912345678"
                  pattern="[0-9]{9}"
                  maxlength="9"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">Formato: 912345678 (sin espacios ni guiones)</p>
            </div>
          </div>

          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Cumpleaños (opcional)
            </label>
            <input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              class="input-field"
            />
            <p class="text-xs text-gray-500 mt-1">Para enviarte felicitaciones especiales 🎂</p>
          </div>

          <!-- Social Media (Optional) -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <span class="text-lg mr-2">📱</span>
              Redes Sociales (opcional)
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="instagram" class="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  id="instagram"
                  v-model="form.instagramLink"
                  type="url"
                  class="input-field"
                  placeholder="https://instagram.com/tu_usuario"
                />
              </div>

              <div>
                <label for="facebook" class="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  id="facebook"
                  v-model="form.facebookLink"
                  type="url"
                  class="input-field"
                  placeholder="https://facebook.com/tu_perfil"
                />
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">Para mantenerte informado de nuestras promociones especiales</p>
          </div>

          <div>
            <label for="comments" class="block text-sm font-medium text-gray-700 mb-1">
              Comentarios Adicionales
            </label>
            <textarea
              id="comments"
              v-model="form.comments"
              rows="3"
              class="input-field resize-none"
              placeholder="Ej: sin azúcar, con relleno extra, hora de entrega preferida..."
            ></textarea>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="ordersStore.error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-600 text-sm">{{ ordersStore.error }}</p>
        </div>

        <!-- Submit Button -->
        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl sm:rounded-b-2xl">
          <button
            type="button"
            @click="ordersStore.closeOrderModal()"
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="ordersStore.loading || !isFormValid"
            class="w-full sm:flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="ordersStore.loading">Procesando...</span>
            <span v-else>Confirmar Pedido 📱</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useProductsStore } from '@/stores/products'
import { useCustomersStore } from '@/stores/customers'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()
const customersStore = useCustomersStore()

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

const handleSubmit = async () => {
  if (!isFormValid.value) return

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
      customerId: customerResult.customerId || null
    }

    // Save order to Firestore
    const orderResult = await ordersStore.createOrder(orderData)

    if (orderResult.success) {
      // Open WhatsApp with pre-filled message
      ordersStore.openWhatsApp(orderData)

      // Clear cart and close modal
      cartStore.clearCart()
      ordersStore.closeOrderModal()
      resetForm()

      // Show success message
      const customerMessage = customerResult.isNew
        ? '¡Bienvenido a nuestra familia de clientes! '
        : '¡Gracias por volver! '

      alert(`${customerMessage}Pedido enviado. Te redirigimos a WhatsApp para completar tu pedido.`)
    }
  } catch (error) {
    console.error('Error processing order:', error)
    alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.')
  }
}
</script>
