# 🧁 Delicias Tía Jovy - Documentación del Proyecto

## 📋 Información General

**Proyecto**: Sitio web de pastelería y mini market
**Cliente**: Delicias Tía Jovy
**Ubicación**: Nueva Imperial, Chile
**Última actualización**: 21 de Junio, 2025 - 7:30 AM
**Estado**: En desarrollo activo

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 5.x
- **Styling**: TailwindCSS 3.x
- **Icons**: Heroicons Vue
- **Router**: Vue Router 4
- **State Management**: Pinia

### Backend & Database

- **Backend**: Firebase (Firestore Database)
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **Storage**: GitHub Repository para imágenes

### Herramientas de Desarrollo

- **Package Manager**: npm
- **Version Control**: Git + GitHub
- **IDE**: Visual Studio Code
- **Deployment**: Firebase CLI

## 🎨 Configuración de Diseño

### Paleta de Colores

```css
primary: #e91e63     /* Rosa fuerte */
secondary: #4a148c   /* Púrpura oscuro */
accent: #f8b88b      /* Naranja pastel */
```

### Tipografías

- **Sans-serif**: Inter (textos generales)
- **Display**: Poppins (títulos y encabezados)

### Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Tailwind CSS estándar
- **Units**: Preferencia por unidades relativas (rem, em, %, vw, vh)

## 🔧 Configuración del Proyecto

### Estructura de Directorios

```
src/
├── components/
│   ├── cart/           # Componentes del carrito
│   ├── layout/         # Layout principal (Navbar, Footer)
│   ├── order/          # Sistema de pedidos
│   ├── products/       # Componentes de productos
│   └── ui/             # Componentes UI reutilizables
├── stores/             # Pinia stores
├── views/              # Páginas principales
├── assets/             # Recursos estáticos
└── router/             # Configuración de rutas
```

### Variables de Entorno

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=deliciastiajovy-6cd88
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 📱 Funcionalidades Implementadas

### ✅ Completadas

- [x] Catálogo de productos dinámico
- [x] Sistema de carrito de compras
- [x] Configuración de tortas (tamaños, rellenos, extras)
- [x] Integración con WhatsApp para pedidos
- [x] Base de datos de clientes
- [x] Panel administrativo básico
- [x] Diseño responsive
- [x] Fondo personalizado SVG
- [x] Sistema de navegación

### 🔄 En Progreso

- [ ] **CRÍTICO**: Posicionamiento del modal del carrito
- [ ] Optimización de imágenes
- [ ] Sistema de notificaciones mejorado

### 📋 Pendientes

- [ ] Sistema de inventario
- [ ] Dashboard de analytics
- [ ] Sistema de promociones
- [ ] Integración con redes sociales
- [ ] PWA (Progressive Web App)

## 🚨 Problemas Conocidos

### 🔴 CRÍTICO - Modal del Carrito

**Problema**: El modal del carrito sigue apareciendo en posición incorrecta

- **Ubicación**: Aparece arriba del footer, debajo de "Entrega a domicilio"
- **Plataformas afectadas**: ❌ Móvil Y ❌ Desktop (confirmado en ambas versiones)
- **Esperado**: Modal centrado con overlay oscuro
- **Última modificación**: 21/06/2025 7:30 AM
- **Estado**: Requiere investigación adicional - problema persiste en todas las plataformas
- **Detalles**: A pesar de implementar la estructura de modal centrado similar al OrderModal, el carrito no se posiciona correctamente en ninguna versión

### 🟡 Menores

- Optimización de carga de imágenes desde GitHub
- Mejoras en la experiencia móvil del admin panel
- Validación de formularios mejorada

## 📦 Instalación y Configuración

### Prerrequisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
Firebase CLI (opcional para deployment)
```

### Instalación desde Cero

```bash
# 1. Clonar el repositorio
git clone https://github.com/maikostudios/www_deliciasTiaJovy.git
cd www_deliciasTiaJovy

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con las credenciales de Firebase

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Configuración de Firebase

1. Crear proyecto en Firebase Console
2. Activar Firestore Database
3. Configurar reglas de seguridad
4. Obtener credenciales del proyecto
5. Actualizar variables de entorno

### Credenciales Actuales

- **Project ID**: `deliciastiajovy-6cd88`
- **Usuario admin**: `deliciastiajovy@gmail.com`
- **Contraseña**: `123456`

## 📱 Estrategia de Números de Teléfono

### Configuración por Ambiente

- **develop**: `+56 9 4947 5207` (Número de pruebas)
- **main**: `+56 9 8463 0545` (Número real de producción)

> 📋 **Documentación completa**: Ver [PHONE-NUMBERS-STRATEGY.md](./PHONE-NUMBERS-STRATEGY.md)

### ⚠️ Reglas Importantes

- **NUNCA** cambiar números en `develop` al hacer merge desde `main`
- **SIEMPRE** mantener número de pruebas en `develop`
- **VERIFICAR** configuración antes de cada deploy

## 🌐 Deployment

### Ramas de Trabajo

- **main**: Código estable + número de producción
- **develop**: Desarrollo activo + número de pruebas
- **produccion**: Versión de producción

### Proceso de Deployment

```bash
# 1. Build del proyecto
npm run build

# 2. Deploy a Firebase Hosting
firebase deploy --only hosting

# 3. URL de producción
https://deliciastiajovy.cl
```

## 📊 Últimos Commits

### Commit más reciente: `fa2b8a5`

**Fecha**: 21/06/2025 7:30 AM
**Mensaje**: "📚 Docs: Crear documentación completa del proyecto"
**Cambios**:

- Documentación técnica completa
- README actualizado con stack tecnológico
- Problema del carrito documentado

### Commit anterior: `874c3df`

**Fecha**: 21/06/2025 7:30 AM
**Mensaje**: "🔧 Fix: Convertir CartDrawer de sidebar a modal centrado"
**Cambios**:

- Transformación de drawer lateral a modal
- Mejoras responsive
- Corrección de z-index y overlay
- **Estado**: ❌ Problema persiste en móvil Y desktop

### Commits Anteriores

- `c72c53f`: Agregar carpeta public completa con imágenes
- `6e4e751`: Implementar fondo SVG personalizado
- `c3022d1`: CRITICAL FIX: Cart not saving cake configuration
- `3c92a35`: Fix: Complete cake configuration display
- `8203cab`: UX Improvement: Change cake filling selection

## 🔗 Enlaces Importantes

### Repositorios

- **Código**: https://github.com/maikostudios/www_deliciasTiaJovy.git
- **Assets**: https://github.com/maikostudios/assets_delicias_tia_jovy.git

### Servicios

- **Sitio Web**: https://deliciastiajovy.cl
- **Firebase Console**: https://console.firebase.google.com/project/deliciastiajovy-6cd88
- **WhatsApp Business**: +56984630545

### Ubicación

- **Google Maps**: https://maps.app.goo.gl/7cyDJrE6joqzzSS58
- **Dirección**: Nueva Imperial, Chile

## 👥 Contactos

### Cliente

- **Email**: deliciastiajovy@gmail.com
- **Password**: 123456 (Firebase Admin)

### Desarrollo

- **Estudio**: Maikostudios
- **Web**: www.maikostudios.com

## 📝 Notas de Desarrollo

### Convenciones de Código

- Usar Composition API de Vue 3
- Preferir unidades relativas en CSS
- Componentes reutilizables en `/components/ui/`
- Stores organizados por funcionalidad

### Testing

- Probar en dispositivos móviles reales
- Verificar funcionalidad del carrito
- Validar integración con WhatsApp
- Comprobar responsive design

### Archivos Importantes

```
.env.local              # Variables de entorno (crear)
firebase.json           # Configuración Firebase
tailwind.config.js      # Configuración TailwindCSS
vite.config.js          # Configuración Vite
package.json            # Dependencias del proyecto
```

## 🚨 Checklist para Nuevo Dispositivo

### ✅ Instalación Básica

- [ ] Node.js >= 18.0.0 instalado
- [ ] Git configurado
- [ ] Clonar repositorio
- [ ] `npm install`
- [ ] Crear `.env.local` con credenciales Firebase

### ✅ Configuración Firebase

- [ ] Acceso a Firebase Console
- [ ] Verificar reglas de Firestore
- [ ] Probar autenticación admin
- [ ] Validar conexión a base de datos

### ✅ Testing

- [ ] `npm run dev` funciona
- [ ] Carrito funciona (verificar posicionamiento)
- [ ] WhatsApp integration funciona
- [ ] Admin panel accesible
- [ ] Responsive design correcto

---

**Última actualización**: 21 de Junio, 2025 - 7:30 AM
**Mantenido por**: Maikostudios
