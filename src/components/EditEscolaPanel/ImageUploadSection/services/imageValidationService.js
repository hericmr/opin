/**
 * Service for validating image files
 */

const DEFAULT_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['jpeg', 'jpg', 'png', 'webp', 'gif'],
};

/**
 * Validate a single image file
 * @param {File} file - File to validate
 * @param {Object} config - Validation configuration (optional)
 * @returns {{isValid: boolean, error?: string}} Validation result
 */
export const validateImageFile = (file, config = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Check MIME type
  if (!finalConfig.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Arquivo "${file.name}" não é uma imagem válida. Use apenas JPG, PNG, WEBP ou GIF.`
    };
  }
  
  // Check file size
  if (file.size > finalConfig.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Arquivo "${file.name}" é muito grande. Tamanho máximo: ${finalConfig.MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }
  
  // Check extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !finalConfig.ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `Extensão não permitida para "${file.name}". Use apenas: ${finalConfig.ALLOWED_EXTENSIONS.join(', ')}`
    };
  }
  
  return { isValid: true };
};

/**
 * Validate multiple image files
 * @param {File[]} files - Array of files to validate
 * @param {Object} config - Validation configuration (optional)
 * @returns {{validFiles: File[], errors: string[]}} Validation results
 */
export const validateImageFiles = (files, config = {}) => {
  const validFiles = [];
  const errors = [];
  
  files.forEach(file => {
    const validation = validateImageFile(file, config);
    if (validation.isValid) {
      validFiles.push(file);
    } else {
      errors.push(validation.error);
    }
  });
  
  return { validFiles, errors };
};

