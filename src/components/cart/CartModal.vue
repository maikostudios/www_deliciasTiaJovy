<template>
  <!-- Modal Overlay with Teleport -->
  <teleport to="body">
    <transition name="cart-modal" appear @after-enter="focusModal" @after-leave="restoreBodyScroll">
      <div v-if="cartStore.isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-[60] flex sm:justify-end justify-center sm:items-stretch items-center p-0 sm:p-4"
        @click="cartStore.closeModal()" @keydown.esc="cartStore.closeModal()">
        <!-- Modal Content -->
        <div ref="modalContent"
          class="bg-white w-full h-full sm:w-96 sm:h-auto sm:max-h-[95vh] sm:rounded-l-xl sm:rounded-r-none rounded-none shadow-xl overflow-hidden flex flex-col cart-content"
          @click.stop role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-describedby="cart-description"
          tabindex="-1">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="cart-title" class="text-xl font-semibold text-gray-900">
              Tu Carrito ({{ cartStore.itemCount }})
            </h2>
            <button @click="cartStore.closeModal()"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200" aria-label="Cerrar carrito"
              title="Cerrar carrito">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <!-- Cart Content -->
          <div class="flex-1 overflow-y-auto">
            <!-- Empty Cart State -->
            <div v-if="cartStore.items.length === 0" class="text-center py-12 px-6">
              <div class="text-6xl mb-4" role="img" aria-label="Carrito vacío">🛒</div>
              <h3 class="text-xl font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p id="cart-description" class="text-gray-500 mb-6">¡Agrega algunos productos deliciosos!</p>
              <button @click="cartStore.closeModal()" class="btn-primary px-6 py-3"
                aria-label="Cerrar carrito e ir a la tienda">
                Ir a la Tienda
              </button>
            </div>

            <!-- Cart Items -->
            <div v-else class="p-6 space-y-4">
              <div v-for="item in cartStore.items" :key="item.id" class="p-4 bg-gray-50 rounded-lg">

                <!-- Product Header -->
                <div class="flex items-start space-x-4 mb-3">
                  <!-- Product Image -->
                  <div
                    class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover"
                      @error="$event.target.style.display = 'none'" />
                    <span v-else class="text-2xl">🧁</span>
                  </div>

                  <!-- Product Info -->
                  <div class="flex-1 min-w-0">
                    <h4 class="text-base font-medium text-gray-900 leading-tight mb-1">{{ item.name }}</h4>
                    <p class="text-sm text-gray-500">{{ formatPrice(item.price) }}</p>
                  </div>

                  <!-- Remove Button -->
                  <button @click="cartStore.removeItem(item.id)"
                    class="p-2 text-red-400 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
                    :aria-label="`Eliminar ${item.name} del carrito`" :title="`Eliminar ${item.name} del carrito`">
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>

                <!-- Configuration Details -->
                <div v-if="item.configuration" class="bg-white rounded-lg p-3 mb-3 border border-gray-200">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">📋 Configuración:</h5>
                  <div class="space-y-1 text-sm">
                    <div v-if="item.configuration.size" class="flex justify-between">
                      <span class="text-gray-600">Tamaño:</span>
                      <span class="font-medium text-gray-900">{{ item.configuration.size }} personas</span>
                    </div>
                    <div v-if="item.configuration.filling" class="flex justify-between">
                      <span class="text-gray-600">Sabor:</span>
                      <span class="font-medium text-gray-900">{{ item.configuration.filling }}</span>
                    </div>
                    <div v-if="item.configuration.extras && item.configuration.extras.length > 0"
                      class="flex justify-between">
                      <span class="text-gray-600">Extras:</span>
                      <span class="font-medium text-gray-900">{{ item.configuration.extras.join(', ') }}</span>
                    </div>
                  </div>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="text-sm text-gray-600">Cantidad:</span>
                    <div class="flex items-center space-x-2">
                      <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                        class="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        :disabled="item.quantity <= 1" :aria-label="`Disminuir cantidad de ${item.name}`"
                        :title="`Disminuir cantidad de ${item.name}`">
                        <MinusIcon class="h-4 w-4" />
                      </button>
                      <span class="w-8 text-center text-sm font-medium" :aria-label="`Cantidad: ${item.quantity}`">{{
                        item.quantity }}</span>
                      <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                        class="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        :aria-label="`Aumentar cantidad de ${item.name}`" :title="`Aumentar cantidad de ${item.name}`">
                        <PlusIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <!-- Item Subtotal -->
                  <div class="text-right">
                    <span class="text-sm text-gray-600">Subtotal:</span>
                    <p class="text-lg font-semibold text-primary">{{ formatPrice(item.price * item.quantity) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer with Total and Actions -->
            <div v-if="cartStore.items.length > 0" class="border-t border-gray-200 p-6 space-y-4">
              <!-- Total -->
              <div class="flex justify-between items-center">
                <span class="text-xl font-semibold text-gray-900">Total:</span>
                <span class="text-2xl font-bold text-primary">{{ cartStore.formattedTotal }}</span>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <button @click="handleMakeOrder"
                  class="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-lg text-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 flex items-center justify-center space-x-2"
                  aria-label="Proceder a hacer pedido por WhatsApp" title="Proceder a hacer pedido por WhatsApp">
                  <span role="img" aria-label="WhatsApp">📱</span>
                  <span>Hacer Pedido</span>
                </button>
                <button @click="cartStore.clearCart()"
                  class="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  aria-label="Vaciar todos los productos del carrito" title="Vaciar todos los productos del carrito">
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useProductsStore } from '@/stores/products'
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()

const modalContent = ref(null)
let previousActiveElement = null

const formatPrice = (price) => productsStore.formatPrice(price)

const handleMakeOrder = () => {
  cartStore.closeModal()
  ordersStore.openOrderModal()
}

// Focus management
const focusModal = async () => {
  previousActiveElement = document.activeElement
  await nextTick()
  if (modalContent.value) {
    modalContent.value.focus()
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
    cartStore.closeModal()
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
/* Cart Modal Animations */
.cart-modal-enter-active,
.cart-modal-leave-active {
  transition: all 0.3s ease;
}

.cart-modal-enter-from,
.cart-modal-leave-to {
  opacity: 0;
}

.cart-modal-enter-from .cart-content,
.cart-modal-leave-to .cart-content {
  transform: translateX(100%);
}

@media (max-width: 640px) {

  .cart-modal-enter-from .cart-content,
  .cart-modal-leave-to .cart-content {
    transform: translateY(100%);
  }
}

.cart-modal-enter-to .cart-content,
.cart-modal-leave-from .cart-content {
  transform: translateX(0);
}

@media (max-width: 640px) {

  .cart-modal-enter-to .cart-content,
  .cart-modal-leave-from .cart-content {
    transform: translateY(0);
  }
}

/* Custom scrollbar for cart items */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
