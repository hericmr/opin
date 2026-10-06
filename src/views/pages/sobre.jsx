import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Info, Users, Code, Mail } from 'lucide-react';
import Footer from '../../components/Footer';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';

const SobrePage = () => {
  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Sobre o OPIN', path: '/sobre', active: true },
  ], []);

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50/30">
      <Helmet>
        <title>Sobre o OPIN – LINDI / UNIFESP</title>
        <meta name="description" content="Saiba mais sobre o Observatório dos Professores Indígenas do Estado de São Paulo." />
      </Helmet>

      <PageHeader
        title="Sobre o OPIN"
        showNavbar={true}
        dataPoints={[]}
        overlayColor="rgba(44, 85, 48, 0.75)"
        blendMode="normal"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      <div className="relative z-10 pb-20 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-10 space-y-10">
            
            {/* O que é */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#215A36]">
                <Info className="w-6 h-6" />
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                  Sobre o OPIN
                </h2>
              </div>
              <div className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  O Observatório dos Professores Indígenas do Estado de São Paulo (OPIN) é uma plataforma que reúne, em um mapa dinâmico, as escolas estaduais indígenas de São Paulo. O site nasce do trabalho dos próprios professores indígenas que produzem, registram e criam os conteúdos de cada escola, suas histórias, seus Projetos Político-Pedagógicos, depoimentos de professores, materiais pedagógicos e produções audiovisuais.
                </p>
                <p>
                  O OPIN é parte da Ação Saberes Indígenas na Escola e busca dar visibilidade às demandas das comunidades e fortalecer os saberes indígenas dentro e fora das escolas.
                </p>
              </div>
            </section>

            {/* Quem produz */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#215A36]">
                <Users className="w-6 h-6" />
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                  Quem produz o conteúdo?
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                O conteúdo do OPIN é de autoria dos professores indígenas vinculados à Licenciatura Intercultural Indígena (LINDI) da UNIFESP. É a partir do trabalho e da experiência de cada um deles que o site ganha forma.
              </p>
            </section>

            {/* Quem desenvolve */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#215A36]">
                <Users className="w-6 h-6" />
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                  Quem desenvolve o OPIN?
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A plataforma é desenvolvida por Héric Moura, assistente social formado pela UNIFESP e desenvolvedor.
              </p>
            </section>

            {/* Tecnologia */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#215A36]">
                <Code className="w-6 h-6" />
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                  Qual tecnologia é utilizada?
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                O OPIN é uma plataforma de código aberto, construída com React e Vite no frontend. O mapa interativo combina OpenLayers e Mapbox GL. Os dados são servidos por uma API PostgREST, com banco de dados PostgreSQL. O código está disponível em <a href="https://github.com/hericmr/opin" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 hover:underline">github.com/hericmr/opin</a>.
              </p>
            </section>

            {/* Contato */}
            <section className="space-y-4 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3 text-[#215A36]">
                <Mail className="w-6 h-6" />
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                  Contato
                </h2>
              </div>
              <p className="text-gray-700">
                E-mail:{' '}
                <a href="mailto:lindi@unifesp.br" className="text-green-600 hover:text-green-800 font-medium hover:underline">
                  lindi@unifesp.br
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SobrePage;
