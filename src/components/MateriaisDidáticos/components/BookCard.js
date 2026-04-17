import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const BookCard = ({ book }) => {
  const rawBaseUrl = process.env.PUBLIC_URL || '/opin';
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  const coverUrl = `${baseUrl}/materiais/${book.cover_image}`;
  const pdfUrl = `${baseUrl}/materiais/${book.pdf_source}`;

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full border border-gray-100 group">
      {/* Container da Capa */}
      <div className="relative bg-gray-100 rounded-md">
        <img
          src={coverUrl}
          alt={`Capa do livro: ${book.title}`}
          className="w-full h-auto block rounded-md"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden group-hover:flex bg-white text-green-800 px-4 py-2 rounded shadow-md items-center gap-2 font-semibold text-sm transition-opacity duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>Ler PDF</span>
          </a>
        </div>
      </div>

      {/* Conteúdo Informativo */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-widest text-green-700 font-bold bg-green-50 px-2 py-1 rounded">
            {book.collection.split('|')[0].trim()}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
          {book.title}
        </h3>

        {book.subtitle && (
          <p className="text-sm text-gray-600 italic mb-3">
            {book.subtitle}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-gray-500">
          <span className="text-xs font-medium">
            {book.volume ? `Volume ${book.volume}` : ''}
          </span>

          <div className="flex gap-3">
            <a
              href={pdfUrl}
              download
              className="p-1.5 hover:text-green-700 transition-colors"
              title="Baixar PDF"
            >
              <Download className="w-4 h-4" />
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:text-green-700 transition-colors"
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;