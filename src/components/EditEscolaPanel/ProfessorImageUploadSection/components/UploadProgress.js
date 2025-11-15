import React from 'react';
import PropTypes from 'prop-types';

/**
 * Upload progress bar component
 * @param {Object} props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {boolean} props.uploading - Whether upload is in progress
 * @param {string} [props.message] - Custom message
 */
const UploadProgress = ({ progress, uploading, message }) => {
  if (!uploading) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-400">
        <span>{message || 'Fazendo upload...'}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

UploadProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  uploading: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

export default UploadProgress;

