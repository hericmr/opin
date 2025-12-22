# Estágio de Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Build da aplicação
# Definir argumento de build para a URL do Backend (pode ser relativo ou absoluto)
ARG VITE_SUPABASE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL

ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# Estágio de Produção
FROM nginx:alpine

# Copiar a configuração do Nginx
COPY config/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos estáticos do build
COPY --from=build /app/build /usr/share/nginx/html/opin

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
