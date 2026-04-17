import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin } from 'lucide-react';
import Footer from '../../components/Footer';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';

const LindiflixContato = () => {
  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Lindiflix', path: '/lindiflix', active: false },
    { label: 'Contato', path: '/lindiflix/contato', active: true },
  ], []);

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50/30">
      <Helmet>
        <title>Contato – LINDI / OPIN</title>
        <meta name="description" content="Entre em contato com a Licenciatura Intercultural Indígena (LINDI) da UNIFESP." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hericmr.github.io/opin/lindiflix/contato" />
        <meta property="og:title" content="Contato – LINDI / OPIN" />
        <meta property="og:description" content="Entre em contato com a Licenciatura Intercultural Indígena (LINDI) da UNIFESP." />
        <meta property="og:image" content="https://hericmr.github.io/opin/hero_grayscale.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contato – LINDI / OPIN" />
        <meta name="twitter:description" content="Entre em contato com a Licenciatura Intercultural Indígena (LINDI) da UNIFESP." />
        <meta name="twitter:image" content="https://hericmr.github.io/opin/hero_grayscale.webp" />
      </Helmet>

      <PageHeader
        title="Contato"
        showNavbar={true}
        dataPoints={[]}
        overlayColor="rgba(44, 85, 48, 0.75)"
        blendMode="normal"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      <div className="relative z-10 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <h2
              className="text-2xl font-semibold text-[#215A36] mb-6"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Licenciatura Intercultural Indígena – LINDI
            </h2>

            <div className="flex items-start gap-4 text-gray-700">
              <MapPin className="w-5 h-5 text-[#215A36] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-1">Endereço</p>
                <p>Rua Silva Jardim, 136</p>
                <p>Santos/SP – CEP: 11070-100</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-gray-700">
              <Phone className="w-5 h-5 text-[#215A36] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-1">Secretaria de Graduação</p>
                <p>Ana Claudia Macieski Martins</p>
                <p>(11) 3385-4255 <span className="text-gray-400 text-sm">(opção 2 – demais cursos)</span></p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-gray-700">
              <Mail className="w-5 h-5 text-[#215A36] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-1">E-mail</p>
                <a
                  href="mailto:lindi@unifesp.br"
                  className="text-[#215A36] hover:underline"
                >
                  lindi@unifesp.br
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LindiflixContato;
