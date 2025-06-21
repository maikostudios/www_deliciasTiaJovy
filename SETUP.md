# 🚀 Guía de Configuración - Delicias Tía Jovy

Esta guía te ayudará a configurar completamente el sitio web de Delicias Tía Jovy.

## 📋 Requisitos Previos

- Node.js 18+ (recomendado)
- Cuenta de Firebase
- Cuenta de Google (para Firebase)

## 🔧 Configuración Paso a Paso

### 1. Configurar Firebase

#### 1.1 Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto: `delicias-tia-jovy`
4. Habilita Google Analytics (opcional)
5. Crea el proyecto

#### 1.2 Configurar Firestore Database
1. En el panel de Firebase, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba"
4. Elige una ubicación (recomendado: `southamerica-east1`)

#### 1.3 Configurar Authentication
1. Ve a "Authentication" en el panel
2. Haz clic en "Comenzar"
3. Ve a la pestaña "Sign-in method"
4. Habilita "Correo electrónico/contraseña"
5. Ve a la pestaña "Users"
6. Haz clic en "Agregar usuario"
7. Crea un usuario administrador:
   - Email: `admin@deliciastiajovy.cl`
   - Contraseña: (elige una segura)

#### 1.4 Obtener Configuración
1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. Baja hasta "Tus apps"
3. Haz clic en "Agregar app" → "Web"
4. Nombra la app: `Delicias Tía Jovy Web`
5. Copia la configuración que aparece

### 2. Configurar el Proyecto Local

#### 2.1 Actualizar Configuración Firebase
1. Abre `src/main.js`
2. Reemplaza la configuración de ejemplo con tu configuración real:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-real",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id-real"
}
```

#### 2.2 Configurar WhatsApp
1. Abre `src/stores/orders.js`
2. Busca la función `openWhatsApp`
3. Reemplaza el número de teléfono por el real:

```javascript
function openWhatsApp(orderData, phoneNumber = '56987654321') {
  // Reemplaza 56987654321 por tu número real
}
```

#### 2.3 Actualizar Información del Negocio
1. Abre `src/components/layout/Footer.vue`
2. Actualiza la información de contacto:
   - Dirección
   - Teléfono
   - Email
   - Horarios

### 3. Agregar Imágenes de Productos

#### 3.1 Preparar Imágenes
- Formato: JPG o PNG
- Tamaño: 800x800px (cuadrado)
- Peso: Máximo 500KB

#### 3.2 Subir Imágenes
1. Coloca las imágenes en `public/images/`
2. Nombres requeridos:
   - `torta-chocolate.jpg`
   - `torta-frutilla.jpg`
   - `torta-tres-leches.jpg`
   - `pan-amasado.jpg`
   - `empanadas.jpg`
   - `sopaipillas.jpg`
   - `torta-sin-azucar.jpg`
   - `galletas-integrales.jpg`
   - `combo-desayuno.jpg`
   - `pack-cumpleanos.jpg`

### 4. Personalizar Productos

#### 4.1 Editar Catálogo
1. Abre `src/stores/products.js`
2. Modifica los productos según tu inventario:
   - Nombres
   - Precios
   - Descripciones
   - Categorías

#### 4.2 Agregar Nuevos Productos
```javascript
{
  id: 11, // Siguiente ID disponible
  name: 'Nuevo Producto',
  price: 5000,
  category: 'tortas', // tortas, panaderia, sin-azucar, ofertas
  image: '/images/nuevo-producto.jpg',
  description: 'Descripción del producto',
  featured: false // true para productos destacados
}
```

### 5. Configurar Hosting (Opcional)

#### 5.1 Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Selecciona tu proyecto
# Public directory: dist
# Single-page app: Yes
# Overwrite index.html: No
npm run build
firebase deploy
```

#### 5.2 Netlify
1. Conecta tu repositorio de GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`

### 6. Configuración SEO Local

#### 6.1 Google My Business
1. Crea perfil en Google My Business
2. Agrega información del negocio
3. Sube fotos de productos
4. Solicita reseñas

#### 6.2 Meta Tags
1. Abre `index.html`
2. Actualiza meta tags con información real
3. Agrega Schema markup para negocio local

### 7. Testing

#### 7.1 Probar Funcionalidades
- [ ] Navegación entre páginas
- [ ] Agregar productos al carrito
- [ ] Formulario de pedidos
- [ ] Integración WhatsApp
- [ ] Login administrador
- [ ] Panel de administración

#### 7.2 Probar en Dispositivos
- [ ] Desktop
- [ ] Tablet
- [ ] Móvil (Android/iOS)

### 8. Lanzamiento

#### 8.1 Checklist Pre-lanzamiento
- [ ] Firebase configurado correctamente
- [ ] Imágenes de productos subidas
- [ ] Información de contacto actualizada
- [ ] Precios actualizados
- [ ] Usuario administrador creado
- [ ] WhatsApp configurado
- [ ] Dominio configurado (si aplica)

#### 8.2 Post-lanzamiento
- [ ] Monitorear pedidos
- [ ] Responder consultas WhatsApp
- [ ] Actualizar productos regularmente
- [ ] Revisar analytics

## 🆘 Solución de Problemas

### Error: Firebase not configured
- Verifica que la configuración en `src/main.js` sea correcta
- Asegúrate de que el proyecto Firebase esté activo

### Error: Authentication failed
- Verifica que Authentication esté habilitado en Firebase
- Confirma que el usuario administrador existe

### WhatsApp no abre
- Verifica el formato del número: `56912345678`
- Prueba en dispositivo móvil

### Imágenes no cargan
- Verifica que las imágenes estén en `public/images/`
- Confirma que los nombres coincidan exactamente

## 📞 Soporte

Si necesitas ayuda adicional:
- Revisa la documentación de Firebase
- Consulta la documentación de Vue.js
- Contacta al desarrollador

---

¡Tu sitio web está listo para endulzar los días de tus clientes! 🧁
