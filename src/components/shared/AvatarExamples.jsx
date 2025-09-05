import React from 'react';
import Avatar from './Avatar';
import FotoProfessor from '../PainelInformacoes/components/FotoProfessor';

/**
 * Exemplos de uso do componente Avatar
 * Demonstra diferentes configurações e funcionalidades
 */
const AvatarExamples = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Exemplos do Componente Avatar
        </h1>

        {/* Seção: Tamanhos */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tamanhos</h2>
          <div className="flex items-end gap-4 p-6 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Avatar name="XS" size="xs" />
              <p className="text-xs mt-2 text-gray-600">xs</p>
            </div>
            <div className="text-center">
              <Avatar name="Small" size="small" />
              <p className="text-xs mt-2 text-gray-600">small</p>
            </div>
            <div className="text-center">
              <Avatar name="Medium" size="medium" />
              <p className="text-xs mt-2 text-gray-600">medium</p>
            </div>
            <div className="text-center">
              <Avatar name="Large" size="large" />
              <p className="text-xs mt-2 text-gray-600">large</p>
            </div>
            <div className="text-center">
              <Avatar name="XLarge" size="xlarge" />
              <p className="text-xs mt-2 text-gray-600">xlarge</p>
            </div>
            <div className="text-center">
              <Avatar name="XXLarge" size="xxlarge" />
              <p className="text-xs mt-2 text-gray-600">xxlarge</p>
            </div>
          </div>
        </section>

        {/* Seção: Temas */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Temas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Avatar name="Default" size="large" theme="default" />
              <p className="text-sm mt-2 text-gray-600">Default</p>
            </div>
            <div className="text-center">
              <Avatar name="Professor" size="large" theme="professor" />
              <p className="text-sm mt-2 text-gray-600">Professor</p>
            </div>
            <div className="text-center">
              <Avatar name="Escola" size="large" theme="escola" />
              <p className="text-sm mt-2 text-gray-600">Escola</p>
            </div>
            <div className="text-center">
              <Avatar name="Indígena" size="large" theme="indigena" />
              <p className="text-sm mt-2 text-gray-600">Indígena</p>
            </div>
            <div className="text-center">
              <Avatar name="Success" size="large" theme="success" />
              <p className="text-sm mt-2 text-gray-600">Success</p>
            </div>
            <div className="text-center">
              <Avatar name="Warning" size="large" theme="warning" />
              <p className="text-sm mt-2 text-gray-600">Warning</p>
            </div>
            <div className="text-center">
              <Avatar name="Error" size="large" theme="error" />
              <p className="text-sm mt-2 text-gray-600">Error</p>
            </div>
            <div className="text-center">
              <Avatar name="Neutral" size="large" theme="neutral" />
              <p className="text-sm mt-2 text-gray-600">Neutral</p>
            </div>
          </div>
        </section>

        {/* Seção: Formas */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Formas</h2>
          <div className="flex gap-6 p-6 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Avatar name="Circle" size="large" shape="circle" />
              <p className="text-sm mt-2 text-gray-600">Círculo</p>
            </div>
            <div className="text-center">
              <Avatar name="Square" size="large" shape="square" />
              <p className="text-sm mt-2 text-gray-600">Quadrado</p>
            </div>
            <div className="text-center">
              <Avatar name="Rounded" size="large" shape="rounded" />
              <p className="text-sm mt-2 text-gray-600">Arredondado</p>
            </div>
            <div className="text-center">
              <Avatar name="None" size="large" shape="none" />
              <p className="text-sm mt-2 text-gray-600">Sem borda</p>
            </div>
          </div>
        </section>

        {/* Seção: Variantes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Variantes de Estilo</h2>
          <div className="flex gap-6 p-6 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Avatar name="Default" size="large" variant="default" />
              <p className="text-sm mt-2 text-gray-600">Default</p>
            </div>
            <div className="text-center">
              <Avatar name="Minimal" size="large" variant="minimal" />
              <p className="text-sm mt-2 text-gray-600">Minimal</p>
            </div>
            <div className="text-center">
              <Avatar name="Flat" size="large" variant="flat" />
              <p className="text-sm mt-2 text-gray-600">Flat</p>
            </div>
            <div className="text-center">
              <Avatar name="Elevated" size="large" variant="elevated" />
              <p className="text-sm mt-2 text-gray-600">Elevated</p>
            </div>
          </div>
        </section>

        {/* Seção: Badges */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Avatar 
                name="Online" 
                size="large" 
                badge="ON" 
                badgeColor="bg-green-500"
                badgePosition="bottom-right"
              />
              <p className="text-sm mt-2 text-gray-600">Online</p>
            </div>
            <div className="text-center">
              <Avatar 
                name="VIP" 
                size="large" 
                badge="VIP" 
                badgeColor="bg-yellow-500"
                badgePosition="top-right"
              />
              <p className="text-sm mt-2 text-gray-600">VIP</p>
            </div>
            <div className="text-center">
              <Avatar 
                name="New" 
                size="large" 
                badge="NEW" 
                badgeColor="bg-blue-500"
                badgePosition="bottom-left"
              />
              <p className="text-sm mt-2 text-gray-600">Novo</p>
            </div>
            <div className="text-center">
              <Avatar 
                name="Admin" 
                size="large" 
                badge="A" 
                badgeColor="bg-red-500"
                badgePosition="top-left"
              />
              <p className="text-sm mt-2 text-gray-600">Admin</p>
            </div>
          </div>
        </section>

        {/* Seção: Estados */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Estados</h2>
          <div className="flex gap-6 p-6 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Avatar name="Loading" size="large" loading={true} />
              <p className="text-sm mt-2 text-gray-600">Carregando</p>
            </div>
            <div className="text-center">
              <Avatar name="Error" size="large" error={true} />
              <p className="text-sm mt-2 text-gray-600">Erro</p>
            </div>
            <div className="text-center">
              <Avatar name="Iniciais" size="large" showInitials={true} />
              <p className="text-sm mt-2 text-gray-600">Iniciais</p>
            </div>
            <div className="text-center">
              <Avatar name="Ícone" size="large" fallbackIcon="user" />
              <p className="text-sm mt-2 text-gray-600">Ícone</p>
            </div>
          </div>
        </section>

        {/* Seção: FotoProfessor */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">FotoProfessor (Wrapper)</h2>
          <div className="flex gap-6 p-6 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <FotoProfessor 
                nomeProfessor="João Silva"
                tamanho="medium"
                theme="professor"
              />
              <p className="text-sm mt-2 text-gray-600">Básico</p>
            </div>
            <div className="text-center">
              <FotoProfessor 
                nomeProfessor="Maria Santos"
                tamanho="medium"
                theme="professor"
                variant="elevated"
                badge="VIP"
              />
              <p className="text-sm mt-2 text-gray-600">Com Badge</p>
            </div>
            <div className="text-center">
              <FotoProfessor 
                nomeProfessor="Pedro Costa"
                tamanho="medium"
                theme="professor"
                clickable
                onClick={() => alert('Professor clicado!')}
              />
              <p className="text-sm mt-2 text-gray-600">Clicável</p>
            </div>
          </div>
        </section>

        {/* Seção: Uso Avançado */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Uso Avançado</h2>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Avatar 
                name="Carlos Eduardo"
                size="large"
                theme="professor"
                variant="elevated"
                badge="ON"
                badgeColor="bg-green-500"
                clickable
                onClick={() => alert('Perfil do professor')}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Carlos Eduardo</h3>
                <p className="text-sm text-gray-600">Professor de Matemática</p>
                <p className="text-xs text-green-600">Online agora</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Avatar 
                name="Ana Lima"
                size="large"
                theme="escola"
                variant="minimal"
                badge="NEW"
                badgeColor="bg-blue-500"
                shape="square"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ana Lima</h3>
                <p className="text-sm text-gray-600">Diretora da Escola</p>
                <p className="text-xs text-blue-600">Nova no sistema</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar 
                name="José Indígena"
                size="large"
                theme="indigena"
                variant="default"
                badge="LEADER"
                badgeColor="bg-amber-600"
                shape="rounded"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">José Indígena</h3>
                <p className="text-sm text-gray-600">Líder da Comunidade</p>
                <p className="text-xs text-amber-600">Líder reconhecido</p>
              </div>
            </div>
          </div>
        </section>

        {/* Código de Exemplo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Código de Exemplo</h2>
          <div className="p-6 bg-gray-900 rounded-lg text-white">
            <pre className="text-sm overflow-x-auto">
{`// Avatar básico
<Avatar 
  src="/foto.jpg"
  name="João Silva"
  size="medium"
/>

// Avatar com tema e badge
<Avatar 
  src="/foto.jpg"
  name="Maria Santos"
  size="large"
  theme="professor"
  variant="elevated"
  badge="VIP"
  badgeColor="bg-yellow-500"
  clickable
  onClick={() => openProfile()}
/>

// FotoProfessor (compatibilidade)
<FotoProfessor 
  fotoUrl="/foto.jpg"
  nomeProfessor="Pedro Costa"
  tamanho="medium"
  theme="professor"
  badge="ON"
  clickable
/>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AvatarExamples;
