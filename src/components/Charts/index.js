// Lazy loading dos componentes de gráficos para reduzir bundle size inicial
// Os gráficos usam recharts, uma biblioteca pesada que só é necessária no Dashboard
// React.lazy está disponível globalmente no React 17+
import { lazy } from 'react';

export const AlunosVsDocentesChart = lazy(() => import('./AlunosVsDocentesChart'));
export const AlunosPorEscolaChart = lazy(() => import('./AlunosPorEscolaChart'));
export const DistribuicaoAlunosChart = lazy(() => import('./DistribuicaoAlunosChart'));
export const DistribuicaoAlunosModalidadeChart = lazy(() => import('./DistribuicaoAlunosModalidadeChart'));
export const DistribuicaoEscolasCombinadoChart = lazy(() => import('./DistribuicaoEscolasCombinadoChart'));
export const EquipamentosChart = lazy(() => import('./EquipamentosChart'));
export const EscolasPorDiretoriaChart = lazy(() => import('./EscolasPorDiretoriaChart'));
export const TiposEnsinoChart = lazy(() => import('./TiposEnsinoChart'));