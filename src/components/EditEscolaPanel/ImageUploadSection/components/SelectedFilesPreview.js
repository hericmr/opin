import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import FilePreview from '../../../shared/FilePreview';

/**
 * Preview of selected files before upload
 * @param {Object} props
 * @param {File[]} props.files - Array of selected files
 * @param {Function} props.onRemove - Callback to remove a file (index: number) => void
 * @param {Function} props.onUpload - Callback to start upload
 * @param {boolean} props.uploading - Whether upload is in progress
 */
const SelectedFilesPreview = ({ files, onRemove, onUpload, uploading }) => {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-100">
        Arquivos selecionados ({files.length})
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {files.map((file, index) => (
          <div key={index} className="relative group">
            <FilePreview
              file={file}
              alt={file.name}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <button
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs text-gray-400 mt-1 truncate">{file.name}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onUpload}
        disabled={uploading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        {uploading ? 'Fazendo Upload...' : 'Fazer Upload'}
      </button>
    </div>
  );
};

SelectedFilesPreview.propTypes = {
  files: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
};

export default SelectedFilesPreview;

