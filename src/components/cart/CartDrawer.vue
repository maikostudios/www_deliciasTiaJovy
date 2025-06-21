<template>
  <!-- Overlay -->
  <div
    v-if="cartStore.isDrawerOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
    @click="cartStore.closeDrawer()"
  ></div>

  <!-- Drawer -->
  <div
    :class="[
      'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
      'md:max-w-md', // En desktop mantener ancho máximo
      'sm:w-full', // En móvil ocupar toda la pantalla
      cartStore.isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">
          Tu Carrito ({{ cartStore.itemCount }})
        </h2>
        <button
          @click="cartStore.closeDrawer()"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cartStore.items.length === 0" class="text-center py-8">
          <div class="text-6xl mb-4">🛒</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
          <p class="text-gray-500 mb-4">¡Agrega algunos productos deliciosos!</p>
          <button
            @click="cartStore.closeDrawer()"
            class="btn-primary"
          >
            Ir a la Tienda
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
          >
            <!-- Product Image -->
            <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover"
                @error="$event.target.style.display = 'none'"
              />
              <span v-else class="text-2xl">🧁</span>
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
              <p class="text-sm text-gray-500">{{ formatPrice(item.price) }}</p>
              
              <!-- Quantity Controls -->
              <div class="flex items-center space-x-2 mt-2">
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
                >
                  <MinusIcon class="h-4 w-4" />
                </button>
                <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
                >
                  <PlusIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Remove Button -->
            <button
              @click="cartStore.removeItem(item.id)"
              class="p-2 text-red-400 hover:text-red-600 transition-colors duration-200"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cartStore.items.length > 0" class="border-t border-gray-200 p-4 space-y-4">
        <!-- Total -->
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold text-gray-900">Total:</span>
          <span class="text-xl font-bold text-primary">{{ cartStore.formattedTotal }}</span>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2">
          <button
            @click="handleMakeOrder"
            class="w-full btn-primary"
          >
            Hacer Pedido 📱
          </button>
          <button
            @click="cartStore.clearCart()"
            class="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useProductsStore } from '@/stores/products'
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()

const formatPrice = (price) => productsStore.formatPrice(price)

const handleMakeOrder = () => {
  cartStore.closeDrawer()
  ordersStore.openOrderModal()
}
</script>
