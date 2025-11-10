import React from 'react';
import CardVisibilityToggle from '../components/CardVisibilityToggle';

const DadosBasicosTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-8">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="basicInfo"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Informações Básicas"
      />
      
      {/* Seção: Informações Principais - Estilo WhatsApp */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#075E54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Informações Principais
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Nome da Escola */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Escola *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 placeholder-gray-400 transition-all duration-200"
              value={editingLocation.Escola || ''}
              onChange={e => setEditingLocation({ ...editingLocation, Escola: e.target.value })}
              placeholder="Digite o nome da escola"
            />
          </div>

          {/* Município */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Município
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 placeholder-gray-400 transition-all duration-200"
              value={editingLocation['Município'] || ''}
              onChange={e => setEditingLocation({ ...editingLocation, 'Município': e.target.value })}
              placeholder="Digite o município"
            />
          </div>

          {/* Ano de Criação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano de Criação da Escola
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 placeholder-gray-400 transition-all duration-200"
              value={editingLocation['Ano de criação da escola'] || ''}
              onChange={e => setEditingLocation({ ...editingLocation, 'Ano de criação da escola': e.target.value })}
              placeholder="Ex: 1995"
            />
          </div>

          {/* Terra Indígena */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terra Indígena (TI)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 placeholder-gray-400 transition-all duration-200"
              value={editingLocation['Terra Indigena (TI)'] || ''}
              onChange={e => setEditingLocation({ ...editingLocation, 'Terra Indigena (TI)': e.target.value })}
              placeholder="Digite o nome da Terra Indígena"
            />
          </div>

          {/* Diretoria de Ensino */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Diretoria de Ensino
            </label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm"
              value={editingLocation['Diretoria de Ensino'] || ''}
              onChange={e => setEditingLocation({ ...editingLocation, 'Diretoria de Ensino': e.target.value })}
              placeholder="Digite a diretoria de ensino"
            />
          </div>

          {/* Parcerias com o Município */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Parcerias com o Município
            </label>
            <textarea
              className="w-full border border-gray-700 bg-gray-800/50 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm resize-none"
              value={editingLocation['Parcerias com o município'] || ''}
              onChange={e => setEditingLocation({ ...editingLocation, 'Parcerias com o município': e.target.value })}
              placeholder="Descreva as parcerias com o município..."
            />
          </div>
        </div>
      </div>

      {/* Seção: Endereço Completo */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Endereço Completo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Logradouro */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Logradouro
            </label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm"
              value={editingLocation.logradouro || ''}
              onChange={e => setEditingLocation({ ...editingLocation, logradouro: e.target.value })}
              placeholder="Rua, Avenida, etc."
            />
          </div>

          {/* Número */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Número
            </label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm"
              value={editingLocation.numero || ''}
              onChange={e => setEditingLocation({ ...editingLocation, numero: e.target.value })}
              placeholder="Número"
            />
          </div>

          {/* Complemento */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Complemento
            </label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm"
              value={editingLocation.complemento || ''}
              onChange={e => setEditingLocation({ ...editingLocation, complemento: e.target.value })}
              placeholder="Apto, Casa, etc."
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Bairro
            </label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm"
              value={editingLocation.bairro || ''}
              onChange={e => setEditingLocation({ ...editingLocation, bairro: e.target.value })}
              placeholder="Nome do bairro"
            />
          </div>

          {/* CEP */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              CEP
            </label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm"
              value={editingLocation.cep || ''}
              onChange={e => setEditingLocation({ ...editingLocation, cep: e.target.value })}
              placeholder="00000-000"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Estado
            </label>
            <select
              className="w-full border border-gray-700 bg-gray-800/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100 transition-all duration-200 backdrop-blur-sm"
              value={editingLocation.estado || 'SP'}
              onChange={e => setEditingLocation({ ...editingLocation, estado: e.target.value })}
            >
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="ES">Espírito Santo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seção: Endereço Antigo (para compatibilidade) */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-100 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Endereço (Campo Legado)
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-3">
            Endereço Completo
          </label>
          <textarea
            className="w-full border border-gray-700 bg-gray-800/50 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm resize-none"
            value={editingLocation['Endereço'] || ''}
            onChange={e => setEditingLocation({ ...editingLocation, 'Endereço': e.target.value })}
            placeholder="Endereço completo da escola..."
          />
          <p className="text-gray-500 text-xs mt-2">
            Este campo é mantido para compatibilidade com dados existentes
          </p>
        </div>
      </div>
    </div>
  );
};

export default DadosBasicosTab; 