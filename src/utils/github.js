/**
 * Utilidades para manejar imágenes desde GitHub
 * Delicias Tía Jovy - Sistema de gestión de imágenes con GitHub
 */

/**
 * Configuración del repositorio de assets
 */
export const githubConfig = {
  owner: 'maikostudios',
  repo: 'assets_delicias_tia_jovy',
  branch: 'main',
  baseUrl: 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main',
  apiUrl: 'https://api.github.com/repos/maikostudios/assets_delicias_tia_jovy/contents',

  // Estructura de carpetas actualizada
  folders: {
    productos: {
      tortas: 'assets/img/productos/Tortas',
      panes: 'assets/img/productos/Panes',
      postres: 'assets/img/productos/Postres',
      combos: 'assets/img/productos/Combos',
      salados: 'assets/img/productos/Salados'
    }
  },

  // Categorías disponibles
  categories: [
    { key: 'tortas', name: 'Tortas', icon: '🎂', folder: 'assets/img/productos/Tortas' },
    { key: 'panes', name: 'Panes', icon: '🍞', folder: 'assets/img/productos/Panes' },
    { key: 'postres', name: 'Postres', icon: '🍰', folder: 'assets/img/productos/Postres' },
    { key: 'combos', name: 'Combos', icon: '🎁', folder: 'assets/img/productos/Combos' },
    { key: 'salados', name: 'Salados', icon: '🥪', folder: 'assets/img/productos/Salados' }
  ]
}

/**
 * Genera URL completa para una imagen en GitHub
 * @param {string} path - Ruta relativa desde la raíz del repo
 * @returns {string} - URL completa de la imagen
 */
export const getGitHubImageUrl = (path) => {
  if (!path) return null
  
  // Limpiar la ruta (remover / inicial si existe)
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  return `${githubConfig.baseUrl}/${cleanPath}`
}

/**
 * Genera URL para imagen de producto según categoría
 * @param {string} category - Categoría del producto (tortas, panes, etc.)
 * @param {string} filename - Nombre del archivo de imagen
 * @returns {string} - URL completa de la imagen
 */
export const getProductImageUrl = (category, filename) => {
  if (!category || !filename) return null
  
  const folder = githubConfig.folders.productos[category]
  if (!folder) {
    console.warn(`Categoría no encontrada: ${category}`)
    return null
  }
  
  return getGitHubImageUrl(`${folder}/${filename}`)
}

/**
 * Extrae información de una URL de GitHub
 * @param {string} url - URL de GitHub raw
 * @returns {object|null} - Información extraída o null
 */
export const parseGitHubUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  
  // Patrón para URLs de GitHub raw
  const pattern = /https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/
  const match = url.match(pattern)
  
  if (!match) return null
  
  return {
    owner: match[1],
    repo: match[2], 
    branch: match[3],
    path: match[4],
    filename: match[4].split('/').pop()
  }
}

/**
 * Valida si una URL de GitHub es válida
 * @param {string} url - URL a validar
 * @returns {boolean} - true si es válida
 */
export const isValidGitHubUrl = (url) => {
  return parseGitHubUrl(url) !== null
}

/**
 * Genera URLs de diferentes tamaños usando GitHub
 * Para GitHub, no hay thumbnails automáticos, pero podemos usar servicios externos
 * @param {string} githubUrl - URL de GitHub
 * @param {string} size - Tamaño deseado
 * @returns {string} - URL optimizada
 */
export const getOptimizedGitHubUrl = (githubUrl, size = 'medium') => {
  if (!githubUrl) return null
  
  // Para GitHub, devolvemos la URL original ya que las imágenes son optimizadas
  // En el futuro se puede integrar con servicios como Cloudinary o ImageKit
  return githubUrl
}

/**
 * Genera datos completos de imagen para un producto desde GitHub
 * @param {string} githubUrl - URL de GitHub
 * @returns {object} - Objeto con información de la imagen
 */
export const generateGitHubImageData = (githubUrl) => {
  if (!githubUrl) return null
  
  const parsed = parseGitHubUrl(githubUrl)
  if (!parsed) return null
  
  return {
    url: githubUrl,
    filename: parsed.filename,
    path: parsed.path,
    repo: `${parsed.owner}/${parsed.repo}`,
    branch: parsed.branch,
    // Para GitHub, todas las URLs son iguales (no hay thumbnails automáticos)
    thumbnail: githubUrl,
    small: githubUrl,
    medium: githubUrl,
    large: githubUrl,
    original: githubUrl
  }
}

/**
 * Instrucciones para usar GitHub como CDN
 */
export const githubInstructions = {
  steps: [
    '1. Sube la imagen al repositorio GitHub en la carpeta correspondiente',
    '2. Ve al archivo en GitHub y haz clic en "Raw"',
    '3. Copia la URL que aparece (debe empezar con raw.githubusercontent.com)',
    '4. Pega la URL en el campo correspondiente',
    '5. La imagen se mostrará automáticamente'
  ],
  
  tips: [
    '💡 Usa nombres descriptivos para las imágenes (ej: torta-dragon-ball.jpg)',
    '📁 Organiza por carpetas según la categoría del producto',
    '📷 Formatos recomendados: JPG, PNG, WebP',
    '📏 Tamaño recomendado: 800x800px o mayor',
    '🚀 Las imágenes se cargan súper rápido desde GitHub'
  ],
  
  urlFormat: {
    pattern: 'https://raw.githubusercontent.com/USUARIO/REPO/BRANCH/RUTA/ARCHIVO.jpg',
    example: 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/productos/Tortas/torta-dragon-ball.jpg'
  }
}

/**
 * Convierte URL de GitHub web a URL raw
 * @param {string} webUrl - URL web de GitHub (github.com)
 * @returns {string|null} - URL raw o null si no es válida
 */
export const convertToRawUrl = (webUrl) => {
  if (!webUrl || typeof webUrl !== 'string') return null
  
  // Patrón para URLs web de GitHub
  const webPattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/
  const match = webUrl.match(webPattern)
  
  if (!match) return null
  
  const [, owner, repo, branch, path] = match
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
}

/**
 * Genera URL de vista previa para GitHub (usando el visor web)
 * @param {string} rawUrl - URL raw de GitHub
 * @returns {string|null} - URL de vista previa
 */
export const getGitHubPreviewUrl = (rawUrl) => {
  const parsed = parseGitHubUrl(rawUrl)
  if (!parsed) return null

  return `https://github.com/${parsed.owner}/${parsed.repo}/blob/${parsed.branch}/${parsed.path}`
}

/**
 * Obtiene la lista de archivos de una carpeta en GitHub
 * @param {string} folderPath - Ruta de la carpeta (ej: 'assets/img/productos/Tortas')
 * @returns {Promise<Array>} - Lista de archivos
 */
export const getGitHubFolderContents = async (folderPath) => {
  try {
    const url = `${githubConfig.apiUrl}/${folderPath}`
    const response = await fetch(url)

    if (!response.ok) {
      // Si es 404, probablemente la carpeta está vacía o no existe
      if (response.status === 404) {
        console.warn(`Carpeta no encontrada o vacía: ${folderPath}`)
        return []
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const contents = await response.json()

    // Filtrar solo archivos de imagen
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const images = contents.filter(item => {
      return item.type === 'file' &&
             imageExtensions.some(ext => item.name.toLowerCase().endsWith(ext))
    })

    return images.map(image => ({
      name: image.name,
      path: image.path,
      downloadUrl: image.download_url,
      // Usar download_url que ya viene codificada correctamente
      rawUrl: image.download_url,
      size: image.size,
      sha: image.sha
    }))
  } catch (error) {
    console.error('Error obteniendo contenido de GitHub:', error)
    return []
  }
}

/**
 * Obtiene todas las imágenes de productos organizadas por categoría
 * @returns {Promise<Object>} - Objeto con imágenes por categoría
 */
export const getAllProductImages = async () => {
  const result = {}

  for (const category of githubConfig.categories) {
    try {
      const images = await getGitHubFolderContents(category.folder)
      result[category.key] = {
        ...category,
        images: images
      }
    } catch (error) {
      console.error(`Error obteniendo imágenes de ${category.name}:`, error)
      result[category.key] = {
        ...category,
        images: []
      }
    }
  }

  return result
}

/**
 * Busca imágenes por nombre en todas las categorías
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} - Lista de imágenes que coinciden
 */
export const searchProductImages = async (searchTerm) => {
  const allImages = await getAllProductImages()
  const results = []

  Object.values(allImages).forEach(category => {
    category.images.forEach(image => {
      if (image.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          ...image,
          category: category.name,
          categoryKey: category.key,
          categoryIcon: category.icon
        })
      }
    })
  })

  return results
}
