import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const BookGallery = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL || '/opin';
        const response = await fetch(`${baseUrl}/materiais/catalog.json`);
        if (!response.ok) {
          throw new Error('Não foi possível carregar o catálogo de materiais.');
        }
        const data = await response.json();
        setBooks(data.books || []);
      } catch (err) {
        console.error('Erro ao carregar catálogo:', err);
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
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-800 rounded-full mb-2">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Saberes Indígenas na Escola
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Livros produzidos por educadores indígenas no âmbito da ação Saberes Indígenas na Escola, em parceria com a UNIFESP no estado de São Paulo. As obras resultam do trabalho de professores indígenas vinculados ao projeto.
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