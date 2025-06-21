import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: 'Inicio - Delicias Tía Jovy'
      }
    },
    {
      path: '/tienda',
      name: 'tienda',
      component: () => import('@/views/TiendaView.vue'),
      meta: {
        title: 'Tienda - Delicias Tía Jovy'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: {
        title: 'Panel de Administración - Delicias Tía Jovy',
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: 'Iniciar Sesión - Delicias Tía Jovy'
      }
    },
    {
      path: '/admin/productos/nuevo',
      name: 'admin-product-new',
      component: () => import('@/views/admin/ProductFormView.vue'),
      meta: {
        title: 'Nuevo Producto - Admin',
        requiresAuth: true
      }
    },
    {
      path: '/admin/productos/editar/:id',
      name: 'admin-product-edit',
      component: () => import('@/views/admin/ProductFormView.vue'),
      meta: {
        title: 'Editar Producto - Admin',
        requiresAuth: true
      }
    }
  ]
})

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  // Import authStore inside the guard to avoid circular dependency
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  // Update page title
  document.title = to.meta.title || 'Delicias Tía Jovy'

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
})

export default router
