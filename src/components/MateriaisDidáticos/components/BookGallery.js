import logger from "../../../utils/logger";
import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import GlobalSpinner from '../../GlobalSpinner';

const BookGallery = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const rawBaseUrl = import.meta.env.BASE_URL || '/';
        const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
        const response = await fetch(`${baseUrl}/materiais/catalog.json`);
        if (!response.ok) {
          throw new Error('Não foi possível carregar o catálogo de materiais.');
        }
        const data = await response.json();
        setBooks(data.books || []);
      } catch (err) {
        logger.error('Erro ao carregar catálogo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  if (loading) {
    return (
      <div className="py-20">
        <GlobalSpinner message="Carregando catálogo..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl text-center">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Intro section */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="mb-6">
          <img
            src={`${import.meta.env.BASE_URL}logo_saberes.webp`}
            alt="Logo"
            className="h-24 sm:h-32 w-auto mx-auto object-contain"
          />
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Jogos e materiais didáticos para impressão, são produzidos no âmbito da ação Saberes Indígenas na Escola.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book, index) => (
          <BookCard key={book.id || index} book={book} />
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 italic">Nenhum material encontrado no momento.</p>
        </div>
      )}
    </div>
  );
};

export default BookGallery;