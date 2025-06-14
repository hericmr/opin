import React, { memo } from 'react';
import { ExternalLink } from 'lucide-react';

const LinkValue = memo(({ href, label, className = '' }) => {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline ${className}`}
    >
      {label || href}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
});

export default LinkValue; 