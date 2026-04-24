# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Remover arquivos de ambiente locais para que o build use apenas as build-args/ENV
# (impede que .env.supabase embuta a URL cloud no bundle Docker)
RUN rm -f .env.supabase .env.local .env.development.local .env.production.local

# Build da aplicação
# Definir argumento de build para a URL do Backend (pode ser relativo ou absoluto)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_API_ANON_KEY
ENV VITE_API_ANON_KEY=$VITE_API_ANON_KEY

RUN npm run build

# Estágio de Produção
FROM nginx:alpine

# Copiar a configuração do Nginx
COPY config/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos estáticos do build
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
