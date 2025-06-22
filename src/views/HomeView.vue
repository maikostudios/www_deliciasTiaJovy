<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary via-secondary to-accent text-white overflow-hidden">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Content -->
          <div class="text-center lg:text-left space-y-6">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Endulzamos tu día
            </h1>
            <p class="text-xl sm:text-2xl text-white/90 leading-relaxed">
              Pastelería y mini market familiar en Nueva Imperial.
              Productos caseros hechos con amor y los mejores ingredientes.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <RouterLink to="/tienda" class="btn-accent text-lg px-8 py-4">
                Ver Productos 🧁
              </RouterLink>
              <button @click="scrollToLocationSection"
                class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-200 rounded-lg font-semibold text-lg">
                📍 Visítanos en Nueva Imperial
              </button>
              <a href="https://wa.me/56949475207" target="_blank"
                class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-200 rounded-lg font-semibold text-lg">
                Contactar 📱
              </a>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="relative">
            <div class="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm p-4 mx-auto max-w-md overflow-hidden">
              <img src="/images/logos/flayer1.jpg" alt="Productos Delicias Tía Jovy"
                class="w-full h-full object-cover rounded-xl shadow-2xl" @error="handleImageError" />
            </div>
            <!-- Floating elements -->
            <div class="absolute top-4 right-4 text-4xl animate-pulse-slow">🎂</div>
            <div class="absolute bottom-8 left-8 text-3xl animate-bounce-slow" style="animation-delay: 0.5s;">🍰</div>
            <div class="absolute top-1/2 -left-4 text-2xl animate-pulse-slow" style="animation-delay: 1s;">🥖</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Showcase & Location Section -->
    <section id="brand-location" class="py-12 bg-transparent-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Brand Showcase -->
          <div class="text-center">
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 lg:p-12 h-full">
              <div class="max-w-md mx-auto mb-6">
                <img src="/images/logos/logo1_fondo_w.jpg" alt="Delicias Tía Jovy - Logo Oficial"
                  class="w-full h-auto rounded-xl shadow-lg" @error="handleBrandLogoError" />
              </div>
              <h2 class="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-4">
                Tradición Familiar desde 2008
              </h2>
              <p class="text-lg text-gray-600 leading-relaxed">
                Más de 15 años endulzando los momentos especiales de Nueva Imperial con productos
                artesanales hechos con amor, dedicación y los mejores ingredientes.
              </p>
            </div>
          </div>

          <!-- Location Quick Access -->
          <div>
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 lg:p-12 h-full">
              <div class="text-center mb-6">
                <h2 class="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-4">
                  📍 Cómo Llegar
                </h2>
                <p class="text-lg text-gray-600 leading-relaxed mb-6">
                  Elige tu aplicación de navegación favorita para llegar hasta nosotros.
                </p>
              </div>

              <!-- Navigation Buttons -->
              <div class="space-y-4">
                <!-- Botón Principal -->
                <button @click="openDirectLink"
                  class="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  <span class="text-2xl">🎯</span>
                  <div class="text-left">
                    <div class="text-lg">¡Navegar Ahora!</div>
                    <div class="text-sm opacity-90">Enlace directo a Google Maps</div>
                  </div>
                </button>

                <!-- Otras Opciones -->
                <p class="text-sm text-gray-500 text-center">O elige tu app favorita:</p>
                <div class="grid grid-cols-2 gap-3">
                  <!-- Apple Maps -->
                  <button @click="openAppleMaps"
                    class="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <span class="text-lg">🍎</span>
                    <span class="text-sm">Apple Maps</span>
                  </button>

                  <!-- Waze -->
                  <button @click="openWaze"
                    class="flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <span class="text-lg">🚗</span>
                    <span class="text-sm">Waze</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-16 lg:py-24 bg-transparent-light">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Image -->
          <div class="relative">
            <div class="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 overflow-hidden">
              <img
                src="https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/ceo/katy.jpg"
                alt="Katy - Fundadora de Delicias Tía Jovy" class="w-full h-full object-cover"
                @error="handleChefImageError" />
            </div>
            <div class="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4">
              <div class="flex items-center space-x-2">
                <span class="text-2xl">⭐</span>
                <div>
                  <p class="font-semibold text-gray-900">+500</p>
                  <p class="text-sm text-gray-600">Clientes felices</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="space-y-6">
            <div>
              <h2 class="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
                Conoce a la Tía Jovy
              </h2>
              <div class="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>

            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Con más de 15 años de experiencia en la repostería, la Tía Jovy ha convertido su pasión
                por la cocina en un negocio familiar que endulza los días de Nueva Imperial.
              </p>
              <p>
                Cada producto es elaborado artesanalmente con ingredientes frescos y de calidad,
                manteniendo las recetas tradicionales que han pasado de generación en generación.
              </p>
              <p>
                Desde tortas personalizadas hasta pan amasado recién horneado, en Delicias Tía Jovy
                encontrarás el sabor casero que tanto extrañas.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl mb-2">🏆</div>
                <p class="font-semibold text-gray-900">15+ Años</p>
                <p class="text-sm text-gray-600">de experiencia</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl mb-2">❤️</div>
                <p class="font-semibold text-gray-900">100%</p>
                <p class="text-sm text-gray-600">Casero</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section id="productos-destacados" class="py-16 lg:py-24 bg-transparent-gray">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Descubre nuestros productos más populares, hechos con amor y los mejores ingredientes
          </p>

          <!-- Value Proposition for Configurable Cakes -->
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 max-w-4xl mx-auto shadow-lg">
            <div class="flex items-center justify-center space-x-3 mb-3">
              <span class="text-3xl">🎨</span>
              <h3 class="text-xl font-semibold text-white">¡Personaliza tu Torta!</h3>
              <span class="text-3xl">🎂</span>
            </div>
            <p class="text-white leading-relaxed">
              Nuestro <strong class="text-yellow-200">valor agregado especial</strong>: Tortas completamente
              personalizables.
              Elige el tamaño, sabor y extras. ¡Cada torta es única como tú!
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <template v-for="product in featuredProducts" :key="product.id">
            <ConfigurableProductCard v-if="product.productType === 'configurable' || product.customizable === true"
              :product="product" />
            <ProductCard v-else :product="product" />
          </template>
        </div>

        <div class="text-center">
          <RouterLink to="/tienda" class="btn-primary text-lg px-8 py-4">
            Ver Todos los Productos
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 lg:py-24 bg-secondary text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-display font-bold mb-6">
          ¿Listo para hacer tu pedido?
        </h2>
        <p class="text-xl text-white/90 mb-8 leading-relaxed">
          Selecciona tus productos favoritos y recíbelos frescos.
          ¡Hacemos entregas en Nueva Imperial!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/tienda" class="btn-accent text-lg px-8 py-4">
            Hacer Pedido 🛒
          </RouterLink>
          <a href="https://wa.me/56949475207" target="_blank"
            class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-secondary transition-all duration-200 rounded-lg font-semibold text-lg">
            WhatsApp 📱
          </a>
        </div>
      </div>
    </section>

    <!-- Location Section with Map -->
    <section id="ubicacion" class="py-16 lg:py-24 bg-transparent-gray">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
            📍 Visítanos en Nueva Imperial
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Te esperamos en nuestro acogedor local. ¡Ven a disfrutar de nuestros productos frescos y el ambiente
            familiar!
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d778.0568762835115!2d-72.9446152303245!3d-38.735541252116285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9615332b7fd5dbb5%3A0x372d246e72746039!2sDelicias%20T%C3%ADa%20Jovy%20Minimarket%20Reposter%C3%ADa%20Panader%C3%ADa%20y%20Gastronomia!5e0!3m2!1ses-419!2scl!4v1750462637699!5m2!1ses-419!2scl"
                  width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade" class="w-full"></iframe>

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
                    <a href="https://wa.me/56949475207" class="text-primary hover:text-primary/80 transition-colors">
                      +56 9 4947 5207
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
                <button @click="openDirectLink"
                  class="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
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
                <!-- Apple Maps -->
                <button @click="openAppleMaps"
                  class="flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <span class="text-xl">🍎</span>
                  <span>Apple Maps</span>
                </button>

                <!-- Waze -->
                <button @click="openWaze"
                  class="flex items-center justify-center space-x-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <span class="text-xl">🚗</span>
                  <span>Waze</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Floating Cart Button & Notification -->
    <FloatingCartButton />

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/products/ProductCard.vue'
import ConfigurableProductCard from '@/components/products/ConfigurableProductCard.vue'
import FloatingCartButton from '@/components/cart/FloatingCartButton.vue'

const productsStore = useProductsStore()

const featuredProducts = computed(() => productsStore.featuredProducts)

// Load products when component mounts
onMounted(async () => {
  try {
    await productsStore.fetchProducts()
  } catch (error) {
    console.error('Error loading products in HomeView:', error)
  }
})

const handleImageError = (event) => {
  // Fallback to emoji display if image fails to load
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<div class="w-full h-full rounded-xl bg-white/20 flex items-center justify-center text-8xl animate-bounce-slow">🧁</div>'
}

const handleChefImageError = (event) => {
  // Fallback to chef emoji if Katy's image fails to load
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<div class="w-full h-full rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-9xl">👩‍🍳</div>'
}

const handleBrandLogoError = (event) => {
  // Fallback for brand logo
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<div class="w-full h-48 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-6xl text-white">🧁</div>'
}

const scrollToLocationSection = () => {
  const locationSection = document.getElementById('ubicacion')
  if (locationSection) {
    locationSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

const scrollToBrandSection = () => {
  const brandSection = document.getElementById('brand-location')
  if (brandSection) {
    brandSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Navigation functions for the quick access section
const googleMapsLink = 'https://maps.app.goo.gl/7cyDJrE6joqzzSS58'
const appleMapsLink = 'https://maps.apple/p/SGTBrzBWwUTjkd'

const openAppleMaps = () => {
  window.open(appleMapsLink, '_blank')
}

const openWaze = () => {
  const url = 'https://www.waze.com/en/live-map/directions/cl/araucania/nueva-imperial/delicias-tia-jovy-minimarket-reposteria-panaderia-y-gastronomia?navigate=yes&place=ChIJtdvVfyszFZYROWB0cm4kLTc'
  window.open(url, '_blank')
}

const openDirectLink = () => {
  window.open(googleMapsLink, '_blank')
}


</script>
