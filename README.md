# Cartografia Social

## 📍 Sobre o Projeto

Esta é uma cartografia social que busca mapear territorialidades, lutas e conquistas dos movimentos sociais e da população na cidade de Santos. O mapa destaca a presença de equipamentos sociais, culturais, religiosos, políticos, educacionais, como escolas, unidades de saúde, assistência social, espaços culturais e de lazer, além de comunidades e locais carregados de memória e história.

### Tipos de Marcadores

- **🔵 Marcador Azul - Lazer**
  - Equipamentos sociais, culturais e de lazer

- **🟢 Marcador Verde - Assistência**
  - Unidades de assistência social e saúde

- **🟡 Marcador Amarelo - Históricos**
  - Lugares históricos e de memória

- **🔴 Marcador Vermelho - Comunidades**
  - Territórios de comunidades

- **🟣 Marcador Violeta - Educação**
  - Escolas e unidades de ensino

- **⚫ Marcador Preto - Religião**
  - Estabelecimentos religiosos

### Contexto Histórico

Entre os elementos mapeados, estão histórias relacionadas à:
- Escravidão e lutas do povo negro
- Opressão e resistência à ditadura empresarial-militar (1964-1984)
- Lutas que moldaram e continuam moldando a identidade da região

### Produção Acadêmica

Os materiais cartográficos e textuais disponíveis aqui foram produzidos pelas(os) estudantes de Serviço Social da UNIFESP do vespertino e noturno durante a Unidade Curricular de Política Social 2, em 2024 e 2025.

## 🚀 Funcionalidades

### Mapa Interativo
- Visualização de pontos de interesse em um mapa interativo
- Diferentes tipos de marcadores por categoria
- Navegação intuitiva e responsiva

### Registro de Informações
- Adição de novos pontos no mapa
- Upload de imagens (múltiplas imagens por local)
- Gravação de áudio para descrições (recurso de acessibilidade)
- Adição de links relacionados
- Descrições detalhadas dos locais

### Recursos de Acessibilidade
- Suporte a descrições em áudio
- Interface adaptável
- Textos claros e legíveis

## 💻 Tecnologias Utilizadas

- React.js
- Leaflet (biblioteca de mapas)
- Tailwind CSS
- Supabase (backend e armazenamento)

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Supabase

### Configuração

1. Clone o repositório:
```bash
git clone https://github.com/hericmr/cartografiasocial.git
cd cartografiasocial
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para um novo arquivo chamado `.env`:
   ```bash
   cp .env.example .env
   ```
   - Abra o arquivo `.env` e substitua os valores com suas credenciais do Supabase:
   ```env
   REACT_APP_SUPABASE_URL=sua_url_do_supabase
   REACT_APP_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```
   > ⚠️ **IMPORTANTE**: Nunca compartilhe ou comite seu arquivo `.env` com as credenciais reais. Este arquivo está incluído no `.gitignore` para sua segurança.

4. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

## 📱 Uso

1. **Visualização do Mapa**
   - Acesse a página inicial para ver todos os pontos mapeados
   - Use os filtros para visualizar categorias específicas

2. **Adição de Novos Pontos**
   - Clique no botão "Adicionar Local"
   - Selecione a localização no mapa
   - Preencha as informações do local
   - Faça upload de imagens
   - Grave uma descrição em áudio (opcional)
   - Adicione links relacionados

3. **Exploração de Locais**
   - Clique nos marcadores para ver detalhes
   - Acesse as imagens, descrições e links
   - Ouça as descrições em áudio quando disponíveis

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Heric Rodrigues - [heric.moura@unifesp.br](mailto:heric.moura@unifesp.br)

Link do projeto: [https://github.com/hericmr/cartografiasocial](https://github.com/hericmr/cartografiasocial)
