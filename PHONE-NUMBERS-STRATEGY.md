# 📱 Estrategia de Números de Teléfono - Delicias Tía Jovy

## 🎯 **Configuración por Ambiente**

### 📋 **Resumen Ejecutivo**

El proyecto maneja **dos números de WhatsApp diferentes** según el ambiente:

- **Desarrollo/Testing**: Número de pruebas para validaciones
- **Producción**: Número real del negocio para clientes

---

## 🔧 **Configuración por Rama**

### 🚀 **Rama `develop` - Ambiente de Desarrollo**

```
📱 Número de Pruebas: +56984630545
🔗 WhatsApp ID: 56984630545
🎯 Propósito: Testing y desarrollo
```

**Uso:**

- Pruebas de funcionalidad de WhatsApp
- Validación de flujos de pedidos
- Testing de integración
- Desarrollo de nuevas funcionalidades

### 🌐 **Rama `main` - Ambiente de Producción**

```
📱 Número Real: +56 9 8463 0545
🔗 WhatsApp ID: 56984630545
🎯 Propósito: Operación real del negocio
🌍 Sitio: deliciastiajovy.cl
```

**Uso:**

- Pedidos reales de clientes
- Contacto comercial
- Soporte al cliente
- Operación diaria del negocio

---

## 📂 **Archivos de Configuración**

### 🔧 **Archivos Principales**

| Archivo                   | Configuración                        | Descripción             |
| ------------------------- | ------------------------------------ | ----------------------- |
| `src/config/business.js`  | `contact.phone` & `contact.whatsapp` | Configuración principal |
| `src/stores/orders.js`    | `openWhatsApp()` función             | WhatsApp para pedidos   |
| `src/data/sample-data.js` | `businessInfo`                       | Datos de ejemplo        |

### 🎨 **Componentes de UI**

| Componente            | Enlaces WhatsApp       | Ubicación          |
| --------------------- | ---------------------- | ------------------ |
| `Footer.vue`          | Iconos y números       | Pie de página      |
| `PromoBanner.vue`     | Botón "Consultar"      | Banner promocional |
| `HomeView.vue`        | Hero + CTA + Ubicación | Página principal   |
| `LocationSection.vue` | Contacto + Ayuda       | Sección ubicación  |

---

## 🔄 **Proceso de Cambio de Ambiente**

### 📝 **Reglas Importantes**

1. **NUNCA** cambiar números en `develop` al hacer merge desde `main`
2. **SIEMPRE** mantener número de pruebas en `develop`
3. **SOLO** usar número real en `main` para producción
4. **VERIFICAR** configuración antes de cada deploy

### 🚀 **Deploy a Producción**

```bash
# 1. Desde develop, hacer merge a main
git checkout main
git merge develop

# 2. Cambiar TODOS los números a producción
# (Ver sección "Archivos a Actualizar")

# 3. Deploy
npm run build
firebase deploy --only hosting
```

### 🔧 **Volver a Desarrollo**

```bash
# 1. Cambiar a develop
git checkout develop

# 2. Verificar que tenga números de prueba
# (Si no, revertir según sección "Archivos a Actualizar")
```

---

## 📋 **Archivos a Actualizar en Cambio de Ambiente**

### 🔧 **1. src/config/business.js**

```javascript
// DEVELOP (Pruebas)
contact: {
  phone: "+56984630545",
  whatsapp: "56984630545",
},
social: {
  whatsapp: "https://wa.me/56984630545",
}

// MAIN (Producción)
contact: {
  phone: "+56 9 8463 0545",
  whatsapp: "56984630545",
},
social: {
  whatsapp: "https://wa.me/56984630545",
}
```

### 🛒 **2. src/stores/orders.js**

```javascript
// DEVELOP (Pruebas)
function openWhatsApp(orderData, phoneNumber = "56984630545") {

// MAIN (Producción)
function openWhatsApp(orderData, phoneNumber = "56984630545") {
```

### 🎨 **3. Componentes UI**

**Buscar y reemplazar en:**

- `src/components/layout/Footer.vue`
- `src/components/layout/PromoBanner.vue`
- `src/views/HomeView.vue`
- `src/components/location/LocationSection.vue`
- `src/data/sample-data.js`

**Patrones a cambiar:**

```
DEVELOP: https://wa.me/56984630545
MAIN:    https://wa.me/56984630545

DEVELOP: +56984630545
MAIN:    +56 9 8463 0545
```

---

## 🔍 **Comandos de Verificación**

### 📱 **Verificar Número Actual**

```bash
# Buscar número de pruebas
Get-ChildItem -Path "src" -Recurse -Include "*.vue","*.js" | Select-String -Pattern "56984630545"

# Buscar número de producción
Get-ChildItem -Path "src" -Recurse -Include "*.vue","*.js" | Select-String -Pattern "56984630545"
```

### ✅ **Validación por Ambiente**

```bash
# En DEVELOP debe mostrar solo 56984630545
# En MAIN debe mostrar solo 56984630545
```

---

## 🚨 **Alertas y Precauciones**

### ⚠️ **IMPORTANTE**

- **NO** hacer merge automático de números entre ramas
- **VERIFICAR** siempre antes de deploy a producción
- **PROBAR** WhatsApp después de cada cambio
- **DOCUMENTAR** cualquier cambio de números

### 🔒 **Seguridad**

- Número de pruebas: Solo para desarrollo interno
- Número de producción: Operación real del negocio
- Mantener confidencialidad de ambos números

---

## 📞 **Contactos de Referencia**

### 📱 **Números Actuales**

- **Desarrollo**: +56984630545 (56984630545)
- **Producción**: +56 9 8463 0545 (56984630545)

### 🌐 **URLs de Verificación**

- **Desarrollo**: http://localhost:5173
- **Producción**: https://deliciastiajovy-6cd88.web.app

---

## 📝 **Historial de Cambios**

| Fecha      | Acción                | Ambiente | Número          |
| ---------- | --------------------- | -------- | --------------- |
| 2024-12-23 | Configuración inicial | develop  | +56984630545    |
| 2024-12-23 | Deploy producción     | main     | +56 9 8463 0545 |
| 2024-12-23 | Documentación creada  | -        | Ambos           |

---

**📋 Última actualización**: 23 de Diciembre, 2024  
**👨‍💻 Responsable**: Equipo de Desarrollo Delicias Tía Jovy
