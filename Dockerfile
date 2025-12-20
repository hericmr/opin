# Estágio de Build
FROM node:20-alpine as build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de Produção
FROM nginx:alpine

# Copiar a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos estáticos do build
COPY --from=build /app/build /usr/share/nginx/html/opin

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
