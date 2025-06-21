/**
 * GitHub Upload Utility
 * Handles automatic upload of images to GitHub repository
 */

const GITHUB_REPO = 'maikostudios/assets_delicias_tia_jovy'
const GITHUB_BRANCH = 'main'
const IMAGES_PATH = 'assets/img/productos'

// Note: For production, this should be handled by a backend service
// GitHub Personal Access Token would be needed and should NOT be exposed in frontend
const GITHUB_TOKEN = null // TODO: Implement backend service

/**
 * Upload a file to GitHub repository
 * @param {File} file - The file to upload
 * @param {string} category - Category folder (Combos, Panes, Postres, etc.)
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Upload result
 */
export async function uploadImageToGitHub(file, category = 'General', onProgress = null) {
  try {
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen')
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('El archivo es demasiado grande. Máximo 2MB.')
    }

    // Clean filename
    const cleanFileName = cleanFileName(file.name)
    const filePath = `${IMAGES_PATH}/${category}/${cleanFileName}`

    // Convert file to base64
    const base64Content = await fileToBase64(file)
    
    // Simulate progress
    if (onProgress) {
      onProgress(25)
    }

    // Check if file already exists
    const existingFile = await checkFileExists(filePath)
    
    if (onProgress) {
      onProgress(50)
    }

    // Prepare GitHub API request
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`
    const requestBody = {
      message: `Add product image: ${cleanFileName}`,
      content: base64Content,
      branch: GITHUB_BRANCH
    }

    // If file exists, we need the SHA for update
    if (existingFile) {
      requestBody.sha = existingFile.sha
      requestBody.message = `Update product image: ${cleanFileName}`
    }

    if (onProgress) {
      onProgress(75)
    }

    // For now, return a mock response since we don't have GitHub token
    // TODO: Implement actual GitHub API call when backend is ready
    if (!GITHUB_TOKEN) {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onProgress) {
        onProgress(100)
      }

      return {
        success: false,
        error: 'Función de subida en desarrollo. Se requiere configurar token de GitHub en el backend.',
        mockUrl: `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`,
        path: filePath,
        name: cleanFileName,
        category: category
      }
    }

    // Actual GitHub API call (when token is available)
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Error ${response.status}`)
    }

    const result = await response.json()
    
    if (onProgress) {
      onProgress(100)
    }

    return {
      success: true,
      url: `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`,
      path: filePath,
      name: cleanFileName,
      category: category,
      sha: result.content.sha
    }

  } catch (error) {
    console.error('GitHub upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Check if file exists in GitHub repository
 * @param {string} filePath - Path to check
 * @returns {Promise<Object|null>} File info or null
 */
async function checkFileExists(filePath) {
  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (response.ok) {
      return await response.json()
    }
    
    return null
  } catch (error) {
    return null
  }
}

/**
 * Convert file to base64
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 string (without data URL prefix)
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      // Remove data URL prefix (data:image/jpeg;base64,)
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Clean filename for GitHub
 * @param {string} filename - Original filename
 * @returns {string} Cleaned filename
 */
function cleanFileName(filename) {
  // Get file extension
  const extension = filename.split('.').pop().toLowerCase()
  
  // Get name without extension
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'))
  
  // Clean the name
  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
  
  // Add timestamp to avoid conflicts
  const timestamp = Date.now()
  
  return `${cleanName}_${timestamp}.${extension}`
}

/**
 * Get available categories from GitHub repository
 * @returns {Promise<Array>} List of categories
 */
export async function getAvailableCategories() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${IMAGES_PATH}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Error ${response.status}`)
    }

    const data = await response.json()
    
    // Filter directories only
    const categories = data
      .filter(item => item.type === 'dir')
      .map(item => item.name)
    
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Return default categories
    return ['Combos', 'Panes', 'Postres', 'Salados', 'Tortas']
  }
}

/**
 * Batch upload multiple files
 * @param {FileList} files - Files to upload
 * @param {string} category - Category for all files
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Array>} Upload results
 */
export async function batchUploadImages(files, category, onProgress = null) {
  const results = []
  const totalFiles = files.length
  
  for (let i = 0; i < totalFiles; i++) {
    const file = files[i]
    
    const fileProgress = (progress) => {
      const overallProgress = ((i * 100) + progress) / totalFiles
      if (onProgress) {
        onProgress(Math.round(overallProgress), i + 1, totalFiles, file.name)
      }
    }
    
    const result = await uploadImageToGitHub(file, category, fileProgress)
    results.push({
      file: file.name,
      ...result
    })
  }
  
  return results
}

export default {
  uploadImageToGitHub,
  getAvailableCategories,
  batchUploadImages
}
