import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import EditLocationPanel from './EditLocationPanel';

const EditLocationWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data, error } = await supabase
          .from('locations3')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setLocation(data);
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('Não foi possível carregar os dados do local.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleSave = async (updatedLocation) => {
    try {
      const { error } = await supabase
        .from('locations3')
        .update({
          titulo: updatedLocation.titulo,
          tipo: updatedLocation.tipo,
          descricao_detalhada: updatedLocation.descricao_detalhada,
          localizacao: `${updatedLocation.latitude},${updatedLocation.longitude}`,
          links: updatedLocation.links,
          audio: updatedLocation.audio,
          imagens: updatedLocation.imagens,
        })
        .eq('id', id);

      if (error) throw error;
      navigate('/admin');
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Não foi possível atualizar o local.');
    }
  };

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!location) {
    return <div className="p-4">Local não encontrado.</div>;
  }

  return (
    <EditLocationPanel
      location={location}
      onClose={() => navigate('/admin')}
      onSave={handleSave}
    />
  );
};

export default EditLocationWrapper; 