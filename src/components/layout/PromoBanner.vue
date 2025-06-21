<template>
  <div class="bg-gradient-to-r from-primary via-secondary to-accent text-white py-8 mb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <!-- Promotional Image -->
        <div class="order-2 lg:order-1">
          <div class="relative rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="/images/logos/flayer1.jpg" 
              alt="Promociones Delicias Tía Jovy" 
              class="w-full h-64 lg:h-80 object-cover"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <div class="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p class="text-gray-900 font-semibold text-sm">
                  ¡Productos frescos todos los días!
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Promotional Content -->
        <div class="order-1 lg:order-2 text-center lg:text-left">
          <h2 class="text-3xl lg:text-4xl font-display font-bold mb-4">
            ¡Ofertas Especiales!
          </h2>
          <p class="text-xl text-white/90 mb-6 leading-relaxed">
            Descubre nuestras promociones semanales y productos destacados. 
            Calidad artesanal al mejor precio.
          </p>
          
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-center lg:justify-start space-x-3">
              <span class="text-2xl">🎂</span>
              <span class="text-lg">Tortas personalizadas</span>
            </div>
            <div class="flex items-center justify-center lg:justify-start space-x-3">
              <span class="text-2xl">🥖</span>
              <span class="text-lg">Pan fresco diario</span>
            </div>
            <div class="flex items-center justify-center lg:justify-start space-x-3">
              <span class="text-2xl">🌿</span>
              <span class="text-lg">Opciones sin azúcar</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              @click="scrollToProducts"
              class="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Ver Productos 🛒
            </button>
            <a
              href="https://wa.me/56949475207"
              target="_blank"
              class="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Consultar 📱
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleImageError = (event) => {
  // Fallback if promotional image fails to load
  event.target.style.display = 'none'
  const fallback = document.createElement('div')
  fallback.className = 'w-full h-64 lg:h-80 bg-white/20 rounded-xl flex items-center justify-center text-6xl'
  fallback.innerHTML = '🧁'
  event.target.parentElement.appendChild(fallback)
}

const scrollToProducts = () => {
  // Scroll to products section if on same page, otherwise navigate
  const productsSection = document.querySelector('#productos-grid')
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' })
  } else {
    // If not on tienda page, navigate there
    window.location.href = '/tienda'
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
