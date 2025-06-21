<template>
  <div id="app" class="min-h-screen bg-custom-pattern overflow-x-hidden">
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

    <!-- Global Notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import CartDrawer from './components/cart/CartDrawer.vue'
import OrderModal from './components/order/OrderModal.vue'
import NotificationContainer from './components/ui/NotificationContainer.vue'
</script>

<style scoped>
#app {
  font-family: 'Inter', system-ui, sans-serif;
}

/* Fondo personalizado con la imagen SVG - Optimizado para móvil */
.bg-custom-pattern {
  background-image: url('/images/fondo-web.svg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: scroll; /* Cambiado de fixed a scroll para móvil */
  /* Fallback color en caso de que la imagen no cargue */
  background-color: #f9fafb;
  /* Asegurar que el fondo sea visible */
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden; /* Prevenir scroll horizontal */
}

/* Overlay sutil para mejorar legibilidad - Optimizado para móvil */
.bg-custom-pattern::before {
  content: '';
  position: absolute; /* Cambiado de fixed a absolute para móvil */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 0;
  width: 100%;
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

/* Reglas responsivas para el fondo */
@media (max-width: 48rem) {
  .bg-custom-pattern {
    background-attachment: scroll !important;
    background-position: center top !important;
  }

  .bg-custom-pattern::before {
    position: absolute !important;
  }
}

@media (min-width: 48.1rem) {
  .bg-custom-pattern {
    background-attachment: fixed;
    background-position: center center;
  }

  .bg-custom-pattern::before {
    position: fixed;
  }
}
</style>
