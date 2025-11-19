/**
 * @fileoverview Type definitions for ImageUploadSection components
 * @typedef {Object} Image
 * @property {string} id - Unique identifier
 * @property {string} url - File path in storage
 * @property {string} publicURL - Public URL for display
 * @property {string} [publicUrl] - Alternative lowercase property name
 * @property {string} filePath - Full file path
 * @property {string} descricao - Description
 * @property {string} created_at - ISO date string
 * @property {LegendData} [legendaData] - Legend/metadata data
 * 
 * @typedef {Object} LegendData
 * @property {string} [legenda] - Main caption
 * @property {string} [descricao_detalhada] - Detailed description
 * @property {string} [autor_foto] - Photo author
 * @property {string} [data_foto] - Photo date (ISO format)
 * @property {string} [categoria] - Category (default: 'geral')
 * 
 * @typedef {Object} DragHandlers
 * @property {Function} onDragStart - Drag start handler
 * @property {Function} onDragOver - Drag over handler
 * @property {Function} onDragLeave - Drag leave handler
 * @property {Function} onDrop - Drop handler
 * @property {Function} onDragEnd - Drag end handler
 */

export {};








