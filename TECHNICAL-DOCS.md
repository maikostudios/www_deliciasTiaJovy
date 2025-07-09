# 🔧 Documentación Técnica - Delicias Tía Jovy

## 📦 Dependencias del Proyecto

### Dependencias de Producción

```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.5",
  "pinia": "^2.1.7",
  "@heroicons/vue": "^2.0.18",
  "firebase": "^10.7.1"
}
```

### Dependencias de Desarrollo

```json
{
  "@vitejs/plugin-vue": "^4.5.2",
  "vite": "^5.0.8",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```

## 🏗️ Arquitectura del Sistema

### Patrón de Diseño

- **Frontend**: MVVM (Model-View-ViewModel) con Vue 3
- **State Management**: Flux pattern con Pinia
- **Routing**: SPA (Single Page Application)
- **Styling**: Utility-first con TailwindCSS

### Estructura de Stores (Pinia)

```javascript
// stores/cart.js - Gestión del carrito
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isDrawerOpen: false
  }),
  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  },
  actions: {
    addItem(product),
    removeItem(id),
    updateQuantity(id, quantity),
    clearCart()
  }
})
```

## 🎨 Sistema de Diseño

### Tokens de Diseño

```css
/* Colores */
:root {
  --color-primary: #e91e63;
  --color-secondary: #4a148c;
  --color-accent: #f8b88b;
  --color-white: #ffffff;
  --color-black: #000000;
}

/* Espaciado */
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */

/* Tipografía */
--font-family-sans: "Inter", system-ui, sans-serif;
--font-family-display: "Poppins", system-ui, sans-serif;
```

### Componentes Reutilizables

```vue
<!-- Botón Primario -->
<button class="btn-primary">
  <!-- Clases: bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 -->
</button>

<!-- Card Container -->
<div class="card">
  <!-- Clases: bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 -->
</div>
```

## 🔥 Configuración Firebase

### Estructura de Firestore

```javascript
// Colección: orders
{
  id: "auto-generated",
  customerInfo: {
    name: "string",
    email: "string",
    phone: "string"
  },
  items: [
    {
      id: "string",
      name: "string",
      price: "number",
      quantity: "number",
      category: "string",
      configuration: {
        size: "string",
        filling: "string",
        extras: ["array"]
      }
    }
  ],
  total: "number",
  comments: "string",
  customerId: "string",
  createdAt: "timestamp",
  status: "pending" | "confirmed" | "completed"
}

// Colección: customers
{
  id: "auto-generated",
  name: "string",
  email: "string",
  phone: "string",
  rut: "string",
  birthDate: "string",
  instagramLink: "string",
  facebookLink: "string",
  createdAt: "timestamp",
  lastOrderAt: "timestamp"
}

// Colección: products
{
  id: "auto-generated",
  name: "string",
  description: "string",
  price: "number",
  category: "string",
  image: "string",
  available: "boolean",
  featured: "boolean",
  configuration: {
    hasSize: "boolean",
    hasFilling: "boolean",
    hasExtras: "boolean",
    sizes: ["array"],
    fillings: ["array"],
    extras: ["array"]
  }
}
```

### Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura de productos a todos
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Permitir escritura de pedidos a todos, lectura solo a admin
    match /orders/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // Permitir escritura de clientes a todos, lectura solo a admin
    match /customers/{document} {
      allow create, update: if true;
      allow read, delete: if request.auth != null;
    }
  }
}
```

## 📱 Integración WhatsApp

### Formato de Mensaje

```javascript
const generateWhatsAppMessage = (orderData) => {
  const { customerInfo, items, total, comments } = orderData;

  let message = `🧁 *NUEVO PEDIDO - DELICIAS TÍA JOVY* 🧁\n\n`;
  message += `👤 *Cliente:* ${customerInfo.name}\n`;
  message += `📧 *Email:* ${customerInfo.email}\n`;
  message += `📱 *Teléfono:* ${customerInfo.phone}\n\n`;

  message += `🛒 *PRODUCTOS:*\n`;
  items.forEach((item) => {
    message += `• ${item.name} x${item.quantity} - $${
      item.price * item.quantity
    }\n`;
    if (item.configuration) {
      if (item.configuration.size)
        message += `  📏 Tamaño: ${item.configuration.size}\n`;
      if (item.configuration.filling)
        message += `  🍰 Relleno: ${item.configuration.filling}\n`;
      if (item.configuration.extras?.length)
        message += `  ➕ Extras: ${item.configuration.extras.join(", ")}\n`;
    }
  });

  message += `\n💰 *TOTAL: $${total}*\n\n`;

  if (comments) {
    message += `💬 *Comentarios:* ${comments}\n\n`;
  }

  message += `📍 *RETIRO/DELIVERY:*\n`;
  message += `• Retiro en local (Nueva Imperial) - PREFERIDO\n`;
  message += `• Delivery disponible en Nueva Imperial y alrededores\n`;
  message += `• Áreas: Labranza, Temuco, Carahue, sectores rurales\n`;
  message += `• Costo delivery según distancia\n\n`;

  message += `📅 *Fecha:* ${new Date().toLocaleDateString("es-CL")}\n`;
  message += `⏰ *Hora:* ${new Date().toLocaleTimeString("es-CL")}\n\n`;

  message += `ℹ️ *INFORMACIÓN IMPORTANTE:*\n`;
  message += `• Pago: 50% adelanto + 50% al entregar\n`;
  message += `• Adelanto no reembolsable\n`;
  message += `• Coordinar fecha de entrega\n\n`;

  message += `¡Gracias por tu pedido! 💕`;

  return encodeURIComponent(message);
};

// URL de WhatsApp
const whatsappURL = `https://wa.me/56984630545?text=${message}`;
```

## 🎯 Configuración de Rutas

### Router Configuration

```javascript
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/tienda",
    name: "tienda",
    component: () => import("@/views/TiendaView.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/AdminView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});
```

## 🔧 Configuración de Build

### Vite Configuration

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "vue-router", "pinia"],
          firebase: ["firebase/app", "firebase/firestore", "firebase/auth"],
        },
      },
    },
  },
});
```

### TailwindCSS Configuration

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e91e63",
        secondary: "#4a148c",
        accent: "#f8b88b",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
      },
    },
  },
  plugins: [],
};
```

## 🚨 Problemas Técnicos Conocidos

### 🔴 CRÍTICO - CartDrawer Modal Positioning

**Descripción**: El modal del carrito no se posiciona correctamente
**Síntomas**:

- Modal aparece en posición fija cerca del footer
- No se centra en la pantalla como debería
- Overlay oscuro funciona correctamente
- Problema presente en móvil Y desktop

**Código Problemático**:

```vue
<!-- CartDrawer.vue - Estructura actual -->
<div
  v-if="cartStore.isDrawerOpen"
  class="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
  @click="cartStore.closeDrawer()"
>
  <div
    class="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:w-auto sm:min-w-[28rem] sm:max-w-[32rem] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto flex flex-col"
    @click.stop
    style="padding-bottom: env(safe-area-inset-bottom);"
  >
```

**Comparación con OrderModal (Funciona)**:

```vue
<!-- OrderModal.vue - Estructura que SÍ funciona -->
<div
  v-if="ordersStore.isOrderModalOpen"
  class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
  @click="handleOverlayClick"
>
```

**Posibles Causas**:

- Conflicto de z-index con otros elementos
- CSS del fondo SVG interfiriendo
- Problema con el store de estado del carrito
- Conflicto con estilos globales de TailwindCSS

**Estado**: Sin resolver - Requiere investigación profunda

---

**Última actualización**: 21 de Junio, 2025 - 7:35 AM
