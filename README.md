# Cartografia Social

## 📍 Sobre o Projeto

O Cartografia Social é uma plataforma web interativa que permite mapear e documentar pontos de interesse social, cultural e histórico em uma determinada região. O projeto visa facilitar o registro e a visualização de locais importantes para a comunidade, criando uma cartografia colaborativa e acessível.

## 🚀 Funcionalidades

### Mapa Interativo
- Visualização de pontos de interesse em um mapa interativo
- Diferentes tipos de marcadores por categoria
- Navegação intuitiva e responsiva

### Tipos de Locais
- 🏥 Assistência Social
- 🎭 Lazer
- 🏛️ Histórico
- 👥 Comunidades
- 📚 Educação
- ⛪ Religião
- 🏘️ Bairro

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
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
REACT_APP_SUPABASE_URL=sua_url_do_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

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
