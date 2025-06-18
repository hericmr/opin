import React, { memo } from 'react';
import PainelDescricao from '../PainelDescricao';

const IntroPanel = memo(({ painelInfo }) => (
  <div className="space-y-6">
    <div className="prose prose-lg lg:prose-xl max-w-none">
      <div className="bg-white rounded-lg p-6">
        <PainelDescricao descricao={painelInfo.descricao_detalhada} />
      </div>
    </div>
    {painelInfo.audioUrl && (
      <div className="mt-6">
        <audio controls className="w-full">
          <source src={painelInfo.audioUrl} type="audio/mpeg" />
          Seu navegador não suporta o elemento de áudio.
        </audio>
      </div>
    )}
  </div>
));

export default IntroPanel; 