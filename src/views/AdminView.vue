<template>
  <AdminSidebar
    :active-section="activeSection"
    :mobile-menu-open="mobileMenuOpen"
    :user-email="authStore.user?.email || 'admin@deliciastiajovy.com'"
    :pending-orders="pendingOrdersCount"
    @navigate="handleNavigation"
    @logout="handleLogout"
    @toggle-mobile="mobileMenuOpen = !mobileMenuOpen"
  >
    <!-- Dynamic content based on active section -->
    <DashboardView v-if="activeSection === 'dashboard'" />

    <OrdersManagement v-else-if="activeSection === 'orders'" />

    <ProductsManagement v-else-if="activeSection === 'products'" />

    <CustomersManagement v-else-if="activeSection === 'customers'" />

    <div v-else-if="activeSection === 'marketing'" class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Marketing</h1>
      <p class="text-gray-600">Próximamente: Campañas y análisis</p>
    </div>
  </AdminSidebar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import DashboardView from '@/components/admin/DashboardView.vue'
import OrdersManagement from '@/components/admin/OrdersManagement.vue'
import ProductsManagement from '@/components/admin/ProductsManagement.vue'
import CustomersManagement from '@/components/admin/CustomersManagement.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

// Sidebar management
const activeSection = ref('dashboard')
const mobileMenuOpen = ref(false)

// Computed properties
const pendingOrdersCount = computed(() => {
  return ordersStore.orders.length
})

// Methods
const handleNavigation = (sectionId) => {
  activeSection.value = sectionId
  mobileMenuOpen.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Initialize section from query params
onMounted(() => {
  if (route.query.section) {
    activeSection.value = route.query.section
  }
})
</script>
