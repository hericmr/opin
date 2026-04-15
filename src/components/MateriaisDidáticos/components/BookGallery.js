import logger from "../../../utils/logger";
import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { motion } from 'framer-motion';

const BookGallery = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const rawBaseUrl = process.env.PUBLIC_URL || '/opin';
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
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-green-800 font-medium">Carregando catálogo...</p>
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
          <p></p>
          <img
            src={`${import.meta.env.BASE_URL || '/opin'}/logo_saberes.webp`}
            alt="Logo Saberes Indígenas na Escola - UNIFESP"
            className="h-24 sm:h-32 w-auto mx-auto object-contain"
          />
        </div>
        <p></p>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Saberes Indígenas na Escola - UNIFESP
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Livros produzidos no âmbito da ação Saberes Indígenas na Escola, em parceria com a UNIFESP no estado de São Paulo.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book, index) => (
          <motion.div
            key={book.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <BookCard book={book} />
          </motion.div>
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