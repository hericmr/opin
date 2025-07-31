// Storage configuration constants

export const STORAGE_BUCKETS = {
  PDFS: 'pdfs',
  MEDIA: 'media', // Keeping for backward compatibility
};

export const FILE_RESTRICTIONS = {
  PDF: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf'],
    MAX_FILES: Infinity, // Sem limite
  },
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
    MAX_FILES: 10,
  },
  AUDIO: {
    MAX_SIZE: 20 * 1024 * 1024, // 20MB
    ALLOWED_TYPES: ['audio/wav', 'audio/mpeg', 'audio/mp3'],
    MAX_FILES: 1,
  },
};

export const FILE_PATHS = {
  PDF: 'documents',
  IMAGE: 'images',
  AUDIO: 'audio',
};

export const getFileType = (file) => {
  if (FILE_RESTRICTIONS.PDF.ALLOWED_TYPES.includes(file.type)) return 'PDF';
  if (FILE_RESTRICTIONS.IMAGE.ALLOWED_TYPES.includes(file.type)) return 'IMAGE';
  if (FILE_RESTRICTIONS.AUDIO.ALLOWED_TYPES.includes(file.type)) return 'AUDIO';
  return null;
};

export const validateFile = (file, type) => {
  const restrictions = FILE_RESTRICTIONS[type];
  if (!restrictions) return { isValid: false, error: 'Tipo de arquivo não suportado' };

  if (!restrictions.ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, error: `Tipo de arquivo não permitido. Use apenas ${type === 'PDF' ? 'PDF' : type === 'IMAGE' ? 'JPG/PNG' : 'WAV/MP3'}` };
  }

  if (file.size > restrictions.MAX_SIZE) {
    return { isValid: false, error: `Arquivo muito grande. Tamanho máximo: ${restrictions.MAX_SIZE / (1024 * 1024)}MB` };
  }

  return { isValid: true };
};

export const generateUniqueFileName = (file, prefix = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop();
  return `${prefix}${timestamp}_${random}.${extension}`;
}; 