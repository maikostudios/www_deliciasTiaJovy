<template>
  <footer class="bg-secondary text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand Info -->
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
              <img
                src="/images/logos/logo2_fondo_t.png"
                alt="Delicias Tía Jovy Logo"
                class="w-full h-full object-contain"
                @error="handleLogoError"
              />
            </div>
            <h3 class="text-xl font-display font-bold">Delicias Tía Jovy</h3>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed">
            Endulzamos tu día con los mejores productos caseros. 
            Pastelería y mini market familiar en Nueva Imperial, Chile.
          </p>
          <div class="flex space-x-4">
            <a
              href="https://wa.me/56949475207"
              target="_blank"
              class="text-gray-300 hover:text-accent transition-colors duration-200"
            >
              <span class="sr-only">WhatsApp</span>
              📱
            </a>
            <a
              href="mailto:contacto@deliciastiajovy.cl"
              class="text-gray-300 hover:text-accent transition-colors duration-200"
            >
              <span class="sr-only">Email</span>
              ✉️
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Enlaces Rápidos</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/" class="text-gray-300 hover:text-accent transition-colors duration-200">
                Inicio
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/tienda" class="text-gray-300 hover:text-accent transition-colors duration-200">
                Tienda
              </RouterLink>
            </li>
            <li>
              <a href="#productos-destacados" class="text-gray-300 hover:text-accent transition-colors duration-200">
                Productos Destacados
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Contacto</h3>
          <div class="space-y-2 text-sm text-gray-300">
            <div class="flex items-center space-x-2">
              <span>📍</span>
              <span>Nueva Imperial, Chile</span>
            </div>
            <div class="flex items-center space-x-2">
              <span>📱</span>
              <a href="https://wa.me/56949475207" class="hover:text-accent transition-colors duration-200">
                +56984630545
              </a>
            </div>
            <div class="flex items-center space-x-2">
              <span>✉️</span>
              <a href="mailto:deliciastiajovy@gmail.com" class="hover:text-accent transition-colors duration-200">
                deliciastiajovy@gmail.com
              </a>
            </div>
            <div class="flex items-center space-x-2">
              <span>🕒</span>
              <span>Lun - Sáb: 8:00 - 20:00</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-600 mt-8 pt-8 text-center space-y-3">
        <p class="text-gray-400 text-sm">
          © {{ currentYear }} Delicias Tía Jovy. Todos los derechos reservados.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
          <span class="text-gray-400">Hecho con 💕 para endulzar tu día</span>
          <span class="hidden sm:inline text-gray-500">•</span>
          <div class="flex items-center space-x-1">
            <span class="text-gray-400">Sitio web creado por</span>
            <a
              href="https://www.maikostudios.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center space-x-1 text-accent hover:text-white transition-colors duration-200 font-semibold"
            >
              <span>✨ Maikostudios</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
        <p class="text-gray-500 text-sm italic">
          "Transformando ideas dulces en experiencias digitales" 🚀
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const currentYear = computed(() => new Date().getFullYear())

const handleLogoError = (event) => {
  // Fallback to emoji if logo fails to load
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<span class="text-primary text-xl">🧁</span>'
}
</script>
