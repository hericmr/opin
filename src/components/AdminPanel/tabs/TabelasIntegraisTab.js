import React from 'react';
import BackupSection, { TABELAS_SISTEMA } from './BackupSection';
import EscolasTable from './EscolasTable';

const TabelasIntegraisTab = () => {
  return (
    <div className="space-y-8">
      <BackupSection />
      <EscolasTable tabelas={TABELAS_SISTEMA} loading={false} />
    </div>
  );
};

export default TabelasIntegraisTab;
