<template>
  <!-- Modal Overlay -->
  <div
    v-if="ordersStore.isOrderModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="handleOverlayClick"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Confirmar Pedido</h2>
        <button
          @click="ordersStore.closeOrderModal()"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Order Summary -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 mb-3">Resumen del Pedido</h3>
          <div class="space-y-2">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex justify-between text-sm"
            >
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
          <h3 class="font-medium text-gray-900">Información de Contacto</h3>
          
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
              <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
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
        <div class="flex space-x-3">
          <button
            type="button"
            @click="ordersStore.closeOrderModal()"
            class="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="ordersStore.loading || !isFormValid"
            class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
import { XMarkIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()

const form = ref({
  name: '',
  email: '',
  phone: '',
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
    comments: ''
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  const orderData = {
    customerInfo: {
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      phone: `+56${form.value.phone.trim()}`
    },
    items: cartStore.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category
    })),
    total: cartStore.totalPrice,
    comments: form.value.comments.trim()
  }

  // Save to Firestore
  const result = await ordersStore.createOrder(orderData)

  if (result.success) {
    // Open WhatsApp with pre-filled message
    ordersStore.openWhatsApp(orderData)
    
    // Clear cart and close modal
    cartStore.clearCart()
    ordersStore.closeOrderModal()
    resetForm()
    
    // Show success message (you could add a toast notification here)
    alert('¡Pedido enviado! Te redirigimos a WhatsApp para completar tu pedido.')
  }
}
</script>
