<template>
  <div id="app" class="min-h-screen bg-custom-pattern">
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

    <!-- Toast Notifications -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import CartDrawer from './components/cart/CartDrawer.vue'
import OrderModal from './components/order/OrderModal.vue'
import Toast from './components/ui/Toast.vue'
</script>

<style scoped>
#app {
  font-family: 'Inter', system-ui, sans-serif;
}

/* Fondo personalizado con la imagen SVG */
.bg-custom-pattern {
  background-image: url('/images/fondo-web.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  /* Fallback color en caso de que la imagen no cargue */
  background-color: #f9fafb;
  /* Asegurar que el fondo sea visible */
  position: relative;
  min-height: 100vh;
}

/* Overlay sutil para mejorar legibilidad */
.bg-custom-pattern::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 0;
}

/* Asegurar que el contenido esté por encima del overlay */
.bg-custom-pattern > * {
  position: relative;
  z-index: 1;
}

/* Clases para fondos transparentes que permiten ver el patrón SVG */
.bg-transparent-white {
  background-color: rgba(255, 255, 255, 0.9);
}

.bg-transparent-gray {
  background-color: rgba(249, 250, 251, 0.9);
}

.bg-transparent-light {
  background-color: rgba(255, 255, 255, 0.7);
}

/* Forzar que el fondo sea visible en el body */
body {
  background-image: url('/images/fondo-web.svg') !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
  background-color: #f9fafb !important;
}
</style>
