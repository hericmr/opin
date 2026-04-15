import React, { useState, useEffect } from 'react';
import BackupSection, { TABELAS_SISTEMA } from './BackupSection';
import EscolasTable from './EscolasTable';

const TabelasIntegraisTab = () => {
  const [tabelas, setTabelas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTabelas(TABELAS_SISTEMA);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <BackupSection />
      <EscolasTable tabelas={tabelas} loading={loading} />
    </div>
  );
};

export default TabelasIntegraisTab;
