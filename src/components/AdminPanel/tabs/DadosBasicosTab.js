import React from 'react';

const DadosBasicosTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Nome da Escola */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">Nome da Escola</label>
        <input
          type="text"
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 min-h-[44px] text-base"
          value={editingLocation.Escola || ''}
          onChange={e => setEditingLocation({ ...editingLocation, Escola: e.target.value })}
          placeholder="Digite o nome da escola"
        />
      </div>

      {/* Município */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">Município</label>
        <input
          type="text"
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 min-h-[44px] text-base"
          value={editingLocation['Município'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Município': e.target.value })}
          placeholder="Digite o município"
        />
      </div>

      {/* Ano de Criação */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">Ano de Criação da Escola</label>
        <input
          type="text"
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 min-h-[44px] text-base"
          value={editingLocation['Ano de criação da escola'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Ano de criação da escola': e.target.value })}
          placeholder="Ex: 1995"
        />
      </div>

      {/* Terra Indígena */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">Terra Indígena (TI)</label>
        <input
          type="text"
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 min-h-[44px] text-base"
          value={editingLocation['Terra Indigena (TI)'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Terra Indigena (TI)': e.target.value })}
          placeholder="Digite o nome da Terra Indígena"
        />
      </div>

      {/* Diretoria de Ensino */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">Diretoria de Ensino</label>
        <input
          type="text"
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 min-h-[44px] text-base"
          value={editingLocation['Diretoria de Ensino'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Diretoria de Ensino': e.target.value })}
          placeholder="Digite a diretoria de ensino"
        />
      </div>

      {/* Parcerias com o Município */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">Parcerias com o Município</label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Parcerias com o município'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Parcerias com o município': e.target.value })}
          placeholder="Descreva as parcerias com o município..."
        />
      </div>

      {/* Endereço Completo */}
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">Endereço Completo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logradouro */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Logradouro</label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400"
              value={editingLocation.logradouro || ''}
              onChange={e => setEditingLocation({ ...editingLocation, logradouro: e.target.value })}
              placeholder="Rua, Avenida, etc."
            />
          </div>

          {/* Número */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Número</label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400"
              value={editingLocation.numero || ''}
              onChange={e => setEditingLocation({ ...editingLocation, numero: e.target.value })}
              placeholder="Número"
            />
          </div>

          {/* Complemento */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Complemento</label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400"
              value={editingLocation.complemento || ''}
              onChange={e => setEditingLocation({ ...editingLocation, complemento: e.target.value })}
              placeholder="Apto, Casa, etc."
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Bairro</label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400"
              value={editingLocation.bairro || ''}
              onChange={e => setEditingLocation({ ...editingLocation, bairro: e.target.value })}
              placeholder="Nome do bairro"
            />
          </div>

          {/* CEP */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">CEP</label>
            <input
              type="text"
              className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400"
              value={editingLocation.cep || ''}
              onChange={e => setEditingLocation({ ...editingLocation, cep: e.target.value })}
              placeholder="00000-000"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Estado</label>
            <select
              className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100"
              value={editingLocation.estado || 'SP'}
              onChange={e => setEditingLocation({ ...editingLocation, estado: e.target.value })}
            >
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="ES">Espírito Santo</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="SC">Santa Catarina</option>
              <option value="PR">Paraná</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MT">Mato Grosso</option>
              <option value="GO">Goiás</option>
              <option value="DF">Distrito Federal</option>
              <option value="BA">Bahia</option>
              <option value="SE">Sergipe</option>
              <option value="AL">Alagoas</option>
              <option value="PE">Pernambuco</option>
              <option value="PB">Paraíba</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="CE">Ceará</option>
              <option value="PI">Piauí</option>
              <option value="MA">Maranhão</option>
              <option value="PA">Pará</option>
              <option value="AP">Amapá</option>
              <option value="TO">Tocantins</option>
              <option value="RO">Rondônia</option>
              <option value="AC">Acre</option>
              <option value="AM">Amazonas</option>
              <option value="RR">Roraima</option>
            </select>
          </div>
        </div>
      </div>

      {/* Endereço Antigo (para compatibilidade) */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">Endereço (Campo Legado)</label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-20 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Endereço'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Endereço': e.target.value })}
          placeholder="Endereço completo (campo legado - use os campos acima para novos registros)"
        />
        <p className="text-xs text-gray-400 mt-1">
          Este campo é mantido para compatibilidade com dados existentes. Para novos registros, use os campos de endereço estruturado acima.
        </p>
      </div>
    </div>
  );
};

export default DadosBasicosTab; 