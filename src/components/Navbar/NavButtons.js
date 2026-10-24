import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { prefetchPage } from '../../router';

// Itens da barra: links diretos ou grupos que abrem um menu
const itensNav = [
  { label: 'Mapa', path: '/mapa', prefetch: 'mapa', title: 'Ir para o mapa das escolas indígenas' },
  {
    label: 'Escolas',
    title: 'Escolas indígenas',
    itens: [
      { label: 'Consultar escolas', path: '/escolas', prefetch: 'escolas', title: 'Ver a lista de escolas indígenas' },
      { label: 'Alguns dados', path: '/algunsdados', prefetch: 'dashboard', title: 'Ver dados das escolas indígenas' },
    ],
  },
  { label: 'Histórias', path: '/historias', prefetch: 'historias', title: 'Ler histórias Guarani Mbya' },
  {
    label: 'Acervo',
    title: 'Materiais, jogos e vídeos',
    itens: [
      { label: 'Materiais didáticos', path: '/conteudo', prefetch: 'conteudo', title: 'Ver materiais didáticos indígenas' },
      { label: 'Jogos', path: '/jogos', prefetch: 'jogos', title: 'Ver jogos' },
      { label: 'Lindiflix', path: '/lindiflix', prefetch: 'lindiflix', title: 'Lindiflix – Vídeos das aldeias indígenas' },
    ],
  },
];

const getButtonStyle = (active) => {
  const baseStyle = 'px-3 xl:px-4 py-1.5 text-base font-medium rounded-lg focus:outline-none relative';
  const activeStyle = 'bg-white/20 text-white shadow-sm';
  const inactiveStyle = 'text-white hover:text-white opacity-80 hover:opacity-100';

  return `${baseStyle} ${active ? activeStyle : inactiveStyle}`;
};

// Grupo com menu suspenso: abre ao passar o mouse ou clicar, fecha ao sair, com Esc ou clique fora
const NavGrupo = ({ grupo, isActive, onNavigate }) => {
  const [aberto, setAberto] = React.useState(false);
  // Distância entre o botão e a borda de baixo da navbar, para o menu abrir logo abaixo dela
  const [folga, setFolga] = React.useState(8);
  const ref = React.useRef(null);
  const ativo = grupo.itens.some((item) => isActive(item.path));
  const menuId = `nav-grupo-${grupo.label.toLowerCase()}`;

  const abrir = () => {
    const header = ref.current?.closest('header');
    if (header) {
      const fimBotao = ref.current.getBoundingClientRect().bottom;
      setFolga(Math.max(0, header.getBoundingClientRect().bottom - fimBotao));
    }
    setAberto(true);
  };

  React.useEffect(() => {
    if (!aberto) return undefined;
    const onClickFora = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false);
    };
    const onTecla = (e) => {
      if (e.key === 'Escape') setAberto(false);
    };
    document.addEventListener('mousedown', onClickFora);
    document.addEventListener('keydown', onTecla);
    return () => {
      document.removeEventListener('mousedown', onClickFora);
      document.removeEventListener('keydown', onTecla);
    };
  }, [aberto]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={abrir}
      onMouseLeave={() => setAberto(false)}
    >
      <button
        type="button"
        onClick={() => (aberto ? setAberto(false) : abrir())}
        className={`${getButtonStyle(ativo)} inline-flex items-center gap-1`}
        title={grupo.title}
        aria-haspopup="true"
        aria-expanded={aberto}
        aria-controls={menuId}
      >
        {grupo.label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`} />
      </button>

      {aberto && (
        // O padding cobre o espaço até a navbar, para o mouse não perder o hover no caminho
        <div className="absolute left-0 top-full z-50" style={{ paddingTop: folga }}>
          <ul id={menuId} className="min-w-[13rem] py-1.5 rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
            {grupo.itens.map((item) => {
              const itemAtivo = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => {
                      setAberto(false);
                      onNavigate(item.path);
                    }}
                    onMouseEnter={() => prefetchPage(item.prefetch)}
                    onFocus={() => prefetchPage(item.prefetch)}
                    title={item.title}
                    aria-current={itemAtivo ? 'page' : undefined}
                    className={`w-full text-left px-4 py-2 text-base border-l-[3px] transition-colors focus:outline-none focus-visible:bg-gray-100 ${
                      itemAtivo
                        ? 'border-[#215A36] bg-emerald-50 text-[#215A36] font-semibold'
                        : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const NavButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/mapa') return location.pathname === '/mapa';
    if (path === '/algunsdados') {
      return location.pathname === '/algunsdados' ||
             location.pathname === '/painel-dados' ||
             location.pathname === '/dados-escolas-indigenas';
    }
    if (path === '/lindiflix') return location.pathname.startsWith('/lindiflix');
    if (path === '/historias') return location.pathname.startsWith('/historia');
    return location.pathname === path;
  };

  return (
    <nav className="flex items-center space-x-2" role="navigation" aria-label="Navegação principal">
      {itensNav.map((item) =>
        item.itens ? (
          <NavGrupo key={item.label} grupo={item} isActive={isActive} onNavigate={navigate} />
        ) : (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => prefetchPage(item.prefetch)}
            onTouchStart={() => prefetchPage(item.prefetch)}
            className={getButtonStyle(isActive(item.path))}
            title={item.title}
            aria-label={item.title}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            {item.label}
          </button>
        )
      )}
    </nav>
  );
};

export default NavButtons;
