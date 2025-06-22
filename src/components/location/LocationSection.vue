<template>
  <section id="ubicacion" class="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
          📍 Visítanos en Nueva Imperial
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Te esperamos en nuestro acogedor local. ¡Ven a disfrutar de nuestros productos frescos y el ambiente familiar!
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Map Section -->
        <div class="order-2 lg:order-1">
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <!-- Map Header -->
            <div class="bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <h3 class="text-xl font-semibold mb-2">🗺️ Nuestra Ubicación</h3>
              <p class="text-white/90">Delicias Tía Jovy - Nueva Imperial, Chile</p>
            </div>
            
            <!-- Google Maps Embed -->
            <div class="relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d778.0568762835115!2d-72.9446152303245!3d-38.735541252116285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9615332b7fd5dbb5%3A0x372d246e72746039!2sDelicias%20T%C3%ADa%20Jovy%20Minimarket%20Reposter%C3%ADa%20Panader%C3%ADa%20y%20Gastronomia!5e0!3m2!1ses-419!2scl!4v1750461714688!5m2!1ses-419!2scl" 
                width="100%" 
                height="400" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                class="w-full"
              ></iframe>
              
              <!-- Map Overlay for Mobile -->
              <div class="absolute inset-0 bg-black/0 pointer-events-none lg:hidden"></div>
            </div>
          </div>
        </div>

        <!-- Info & Navigation Section -->
        <div class="order-1 lg:order-2 space-y-8">
          <!-- Address Info -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span class="text-2xl mr-3">🏪</span>
              Información del Local
            </h3>
            <div class="space-y-3 text-gray-600">
              <div class="flex items-start space-x-3">
                <span class="text-primary mt-1">📍</span>
                <div>
                  <p class="font-medium text-gray-900">Dirección</p>
                  <p>Nueva Imperial, Región de La Araucanía, Chile</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-primary mt-1">🕒</span>
                <div>
                  <p class="font-medium text-gray-900">Horarios de Atención</p>
                  <p>Lunes a Viernes: 8:00 - 20:00</p>
                  <p>Sábado: 8:00 - 18:00</p>
                  <p>Domingo: Cerrado</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-primary mt-1">📱</span>
                <div>
                  <p class="font-medium text-gray-900">Contacto</p>
                  <a href="https://wa.me/56984630545" class="text-primary hover:text-primary/80 transition-colors">
                    +56 9 8463 0545
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span class="text-2xl mr-3">🧭</span>
              Cómo Llegar
            </h3>
            <p class="text-gray-600 mb-6">
              Elige tu aplicación de navegación favorita para llegar hasta nosotros.
              Los enlaces se abren directamente en tu app preferida:
            </p>
            
            <!-- Botón Principal -->
            <div class="mb-6">
              <button
                @click="openDirectLink"
                class="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span class="text-2xl">🎯</span>
                <div class="text-left">
                  <div class="text-lg">¡Navegar Ahora!</div>
                  <div class="text-sm opacity-90">Enlace directo a Google Maps</div>
                </div>
              </button>
            </div>

            <!-- Otras Opciones -->
            <p class="text-sm text-gray-500 mb-4 text-center">O elige tu app favorita:</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Google Maps -->
              <button
                @click="openGoogleMaps"
                class="flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span class="text-xl">🗺️</span>
                <span>Google Maps</span>
              </button>

              <!-- Waze -->
              <button
                @click="openWaze"
                class="flex items-center justify-center space-x-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span class="text-xl">🚗</span>
                <span>Waze</span>
              </button>

              <!-- Apple Maps -->
              <button
                @click="openAppleMaps"
                class="flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span class="text-xl">🍎</span>
                <span>Apple Maps</span>
              </button>

              <!-- Generic Navigation -->
              <button
                @click="openGenericMaps"
                class="flex items-center justify-center space-x-3 bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span class="text-xl">📍</span>
                <span>Navegar</span>
              </button>
            </div>

            <!-- Additional Info -->
            <div class="mt-6 p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
              <p class="text-sm text-gray-700 text-center mb-2">
                <span class="font-semibold">💡 Tip:</span>
                Si tienes problemas para encontrarnos, ¡llámanos al
                <a href="https://wa.me/56984630545" class="text-primary font-semibold hover:underline">
                  +56 9 8463 0545
                </a>
                y te ayudamos! 😊
              </p>
              <div class="text-xs text-gray-600 text-center space-y-1">
                <p>
                  📱 <span class="font-medium">Google Maps:</span>
                  <a href="https://maps.app.goo.gl/7cyDJrE6joqzzSS58" target="_blank" class="text-primary hover:underline font-mono">
                    maps.app.goo.gl/7cyDJrE6joqzzSS58
                  </a>
                </p>
                <p>
                  🍎 <span class="font-medium">Apple Maps:</span>
                  <a href="https://maps.apple/p/SGTBrzBWwUTjkd" target="_blank" class="text-primary hover:underline font-mono">
                    maps.apple/p/SGTBrzBWwUTjkd
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Coordenadas y enlaces de Delicias Tía Jovy
const latitude = -38.735541252116285
const longitude = -72.9446152303245
const businessName = 'Delicias Tía Jovy'
const address = 'Nueva Imperial, Región de La Araucanía, Chile'
const googleMapsLink = 'https://maps.app.goo.gl/7cyDJrE6joqzzSS58'
const appleMapsLink = 'https://maps.apple/p/SGTBrzBWwUTjkd'

const openGoogleMaps = () => {
  // Usar el enlace directo de Google Maps que es más confiable
  window.open(googleMapsLink, '_blank')
}

const openWaze = () => {
  const url = 'https://www.waze.com/en/live-map/directions/cl/araucania/nueva-imperial/delicias-tia-jovy-minimarket-reposteria-panaderia-y-gastronomia?navigate=yes&place=ChIJtdvVfyszFZYROWB0cm4kLTc'
  window.open(url, '_blank')
}

const openAppleMaps = () => {
  // Usar el enlace directo de Apple Maps proporcionado
  window.open(appleMapsLink, '_blank')
}

const openGenericMaps = () => {
  // Usar el enlace directo de Google Maps que funciona en todos los dispositivos
  // Este enlace se abre en la app nativa si está instalada, o en el navegador
  window.open(googleMapsLink, '_blank')
}

const openDirectLink = () => {
  // Función principal que usa el enlace directo proporcionado
  window.open(googleMapsLink, '_blank')
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
iframe {
  filter: grayscale(0);
  transition: filter 0.3s ease;
}

iframe:hover {
  filter: grayscale(0) brightness(1.05);
}
</style>
