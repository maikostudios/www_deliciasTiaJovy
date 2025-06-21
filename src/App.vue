<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main Content -->
    <main>
      <RouterView />
    </main>
    
    <!-- Cart Drawer -->
    <CartDrawer />
    
    <!-- Order Modal -->
    <OrderModal />
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import CartDrawer from './components/cart/CartDrawer.vue'
import OrderModal from './components/order/OrderModal.vue'
</script>

<style scoped>
#app {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
