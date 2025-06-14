import React, { memo } from 'react';
import ShareButton from '../ShareButton';

const ShareSection = memo(({ copiarLink, compartilhar }) => (
  <div className="mt-8 flex justify-center space-x-4">
    <ShareButton onClick={copiarLink} onShare={compartilhar} />
  </div>
));

export default ShareSection; 