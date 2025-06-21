# 🧁 Delicias Tía Jovy

Sitio web moderno para la pastelería y mini market familiar **Delicias Tía Jovy** en Nueva Imperial, Chile.

## 🚀 Características

- **Vue 3 + Vite**: Framework moderno y rápido
- **TailwindCSS**: Diseño responsivo y mobile-first
- **Firebase**: Backend completo (Firestore + Auth)
- **WhatsApp Integration**: Pedidos directos por WhatsApp
- **Panel Admin**: Gestión de pedidos
- **PWA Ready**: Optimizado para móviles

## 🎨 Paleta de Colores

- 🎀 **Primary**: `#e91e63` (Rosado fuerte)
- 💜 **Secondary**: `#4a148c` (Púrpura oscuro)
- 🧡 **Accent**: `#f8b88b` (Naranja pastel)
- ⚪ **White**: `#ffffff`
- ⚫ **Black**: `#000000`

## 📱 Funcionalidades

### Para Clientes
- Catálogo de productos por categorías
- Carrito de compras
- Formulario de pedidos
- Integración con WhatsApp
- Diseño mobile-first

### Para Administradores
- Panel de administración privado
- Visualización de pedidos
- Estadísticas básicas
- Autenticación segura

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd www_deliciasTiaJovy
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Firebase (✅ Ya Configurado)**
   - Project ID: `deliciastiajovy-6cd88`
   - Usuario admin: `deliciastiajovy@gmail.com`
   - Contraseña: `123456`
   - Ver detalles en `FIREBASE-SETUP.md`

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## 🔧 Configuración Firebase

### 1. Firestore Database
Crear las siguientes colecciones:
- `orders`: Para almacenar los pedidos

### 2. Authentication
- Habilitar "Email/Password" como proveedor
- Crear usuario administrador

### 3. Hosting (Opcional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/          # Navbar, Footer, PromoBanner
│   ├── products/        # ProductCard, ProductGrid
│   ├── cart/           # CartDrawer
│   └── order/          # OrderModal
├── stores/             # Pinia stores
│   ├── auth.js         # Autenticación
│   ├── cart.js         # Carrito de compras
│   ├── orders.js       # Gestión de pedidos
│   └── products.js     # Catálogo de productos
├── views/              # Páginas principales
│   ├── HomeView.vue    # Página de inicio
│   ├── TiendaView.vue  # Catálogo completo
│   ├── AdminView.vue   # Panel de administración
│   └── LoginView.vue   # Login para admin
├── data/               # Datos de ejemplo
└── router/             # Configuración de rutas

public/
├── images/
│   ├── logos/          # Logos y material promocional
│   │   ├── logo1_fondo_w.jpg    # Logo con fondo blanco
│   │   ├── logo2_fondo_t.png    # Logo con fondo transparente
│   │   └── flayer1.jpg          # Flyer promocional
│   └── productos/      # Imágenes de productos (por agregar)
```

## 🎯 Rutas

- `/` - Página de inicio con hero y productos destacados
- `/tienda` - Catálogo completo con filtros
- `/admin` - Panel de administración (requiere auth)
- `/login` - Inicio de sesión para administradores

## 📱 WhatsApp Integration

Los pedidos se envían automáticamente a WhatsApp con el siguiente formato:

```
🧁 NUEVO PEDIDO - DELICIAS TÍA JOVY 🧁

👤 Cliente: [Nombre]
📧 Email: [Email]
📱 Teléfono: [Teléfono]

🛒 PRODUCTOS:
• [Producto] x[Cantidad] - $[Precio]

💰 TOTAL: $[Total]

💬 Comentarios: [Comentarios]

📅 Fecha: [Fecha]
⏰ Hora: [Hora]

¡Gracias por tu pedido! 💕
```

## 🔐 Seguridad

- Autenticación Firebase para panel admin
- Validación de formularios
- Sanitización de datos
- Rutas protegidas

## 📊 SEO y Performance

- Meta tags optimizados
- Imágenes optimizadas
- Lazy loading
- Core Web Vitals optimizados
- Schema markup para negocio local

## 🚀 Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Netlify
```bash
npm run build
# Subir carpeta dist/
```

### Vercel
```bash
npm run build
# Conectar repositorio
```

## 📞 Contacto

- **Ubicación**: Nueva Imperial, Chile
- **WhatsApp**: +56 9 1234 5678
- **Email**: contacto@deliciastiajovy.cl

## 📄 Licencia

Este proyecto está desarrollado para uso exclusivo de **Delicias Tía Jovy**.

---

Hecho con 💕 para endulzar tu día
