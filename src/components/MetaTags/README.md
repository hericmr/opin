# Sistema de Meta Tags Dinâmicas

Sistema modular e expansível para gerenciar meta tags de compartilhamento social.

## 🎯 Funcionalidades

- **Detecção Automática** de escola via URL (`?panel=slug-da-escola`)
- **Meta Tags Customizadas** para cada escola específica
- **Open Graph** (Facebook, WhatsApp, LinkedIn, Telegram, Discord)
- **Twitter Cards** (Twitter/X)
- **Google SEO** (meta tags, structured data)
- **Dados Estruturados** (JSON-LD)

## 📁 Estrutura Modular

```
src/components/MetaTags/
├── index.js                 # Exportações principais
├── MetaTagsManager.js       # Componente orquestrador
├── MetaTagsDetector.js      # Detecção automática de escola
├── OpenGraphTags.js         # Meta tags Open Graph
├── TwitterCardTags.js       # Twitter Cards
├── GoogleSEOTags.js         # Meta tags Google SEO
├── StructuredDataTags.js    # Dados estruturados JSON-LD
├── MetaTagsTest.js          # Componente de teste
├── MetaTagsDetectorTest.js  # Teste do detector
├── MetaTagsUrlTest.js       # Teste de URLs específicas
└── README.md               # Esta documentação
```

## 🚀 Como Usar

### Detecção Automática (Recomendado)
```jsx
import { MetaTagsDetector } from './components/MetaTags';

// No App.js - detecta automaticamente qual escola está sendo visualizada
<MetaTagsDetector dataPoints={dataPoints} />
```

### Uso Manual
```jsx
import { MetaTagsManager } from './components/MetaTags';

// No seu componente
<MetaTagsManager escola={escolaData} />
```

### Uso Avançado (Controle Granular)
```jsx
import { MetaTagsManager } from './components/MetaTags';

<MetaTagsManager 
  escola={escolaData}
  enableOpenGraph={true}
  enableTwitterCards={true}
  enableGoogleSEO={true}
  enableStructuredData={true}
/>
```

### Componentes Individuais
```jsx
import { 
  OpenGraphTags, 
  TwitterCardTags, 
  GoogleSEOTags, 
  StructuredDataTags 
} from './components/MetaTags';

// Use apenas os que precisar
<OpenGraphTags escola={escolaData} />
<TwitterCardTags escola={escolaData} />
```

## 🔧 Configuração

### Configurações Padrão
Edite `src/utils/metaTags.js`:

```javascript
// Use META_TAGS_CONFIG from '../../config/metaTagsConfig' instead
// export const DEFAULT_META_CONFIG = {
  siteName: 'OPIN - Observatório dos Professores Indígenas',
  siteUrl: 'https://hericmr.github.io/escolasindigenas',
  defaultImage: '/escolasindigenas/onça.svg',
  twitterHandle: '@OPIN_SP', // Adicione se existir
  locale: 'pt_BR'
};
```

### Adicionando Novas Redes Sociais

1. **Criar novo componente** (ex: `PinterestTags.js`)
2. **Adicionar ao MetaTagsManager**
3. **Exportar no index.js**

## 📱 Redes Sociais Suportadas

| Rede Social | Meta Tags | Status |
|-------------|-----------|--------|
| Facebook | Open Graph | ✅ |
| WhatsApp | Open Graph | ✅ |
| LinkedIn | Open Graph | ✅ |
| Twitter/X | Twitter Cards | ✅ |
| Telegram | Open Graph | ✅ |
| Discord | Open Graph | ✅ |
| Pinterest | Open Graph | ✅ |
| Google Search | SEO + JSON-LD | ✅ |

## 🧪 Testando

### Ferramentas de Teste
- **Facebook**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- **Google**: [Rich Results Test](https://search.google.com/test/rich-results)

### Componente de Teste
```jsx
import { MetaTagsTest } from './components/MetaTags';

<MetaTagsTest escola={escolaData} />
```

### Teste de URLs Específicas
```jsx
import { MetaTagsUrlTest } from './components/MetaTags';

<MetaTagsUrlTest dataPoints={dataPoints} />
```

## 🎯 URLs Customizadas

### Como Funciona
O sistema detecta automaticamente qual escola está sendo visualizada através do parâmetro `panel` na URL:

```
https://hericmr.github.io/escolasindigenas/?panel=e-e-i-nhandepouwa
```

### Meta Tags Geradas
Para cada escola específica, são geradas meta tags customizadas:

- **Título**: "E.E.I. Nhandepouwa - Escola Indígena"
- **Descrição**: "Escola Indígena: E.E.I. Nhandepouwa - São Paulo | Povos: Guarani | Línguas: Guarani, Português | Observatório de Professores Indígenas"
- **URL**: Link direto para a escola
- **Imagem**: Foto da escola (quando disponível)

### Exemplo de URLs
- `?panel=e-e-i-nhandepouwa` → E.E.I. Nhandepouwa
- `?panel=e-e-i-aldeia-ywy-pyhau` → E.E.I. Aldeia Ywy Pyhau
- `?panel=e-e-i-pindoty` → E.E.I. Pindoty

## 🔄 Expansibilidade

### Adicionando Nova Rede Social

1. **Criar componente específico**:
```jsx
// TikTokTags.js
const TikTokTags = ({ escola }) => {
  return (
    <Helmet>
      <meta name="tiktok:title" content={title} />
      <meta name="tiktok:description" content={description} />
    </Helmet>
  );
};
```

2. **Adicionar ao MetaTagsManager**:
```jsx
const MetaTagsManager = ({ escola, enableTikTok = true }) => {
  return (
    <>
      {enableOpenGraph && <OpenGraphTags escola={escola} />}
      {enableTwitterCards && <TwitterCardTags escola={escola} />}
      {enableTikTok && <TikTokTags escola={escola} />}
    </>
  );
};
```

3. **Exportar no index.js**:
```jsx
export { default as TikTokTags } from './TikTokTags';
```

## 📊 Monitoramento

### Logs de Debug
O sistema inclui logs para debug:
```javascript
console.log('Meta tags geradas para:', escola.titulo);
```

### Verificação Manual
1. Abra DevTools → Elements
2. Procure por `<meta>` tags no `<head>`
3. Verifique se as tags estão corretas

## 🐛 Troubleshooting

### Meta Tags Não Aparecem
1. Verifique se `HelmetProvider` está no App.js
2. Confirme se `MetaTagsManager` está sendo renderizado
3. Verifique se `escola` não é null/undefined

### Imagens Não Carregam
1. Verifique URLs das imagens
2. Confirme se as imagens são públicas
3. Teste com imagem padrão

### URLs Incorretas
1. Verifique `META_TAGS_CONFIG.site.url`
2. Confirme se `gerarUrlEscola()` está funcionando
3. Teste com URL manual

## 📈 Performance

- **Lazy Loading**: Componentes carregam apenas quando necessário
- **Memoização**: URLs e textos são memoizados
- **Modular**: Use apenas os componentes necessários
- **Cache**: Meta tags são geradas apenas quando escola muda