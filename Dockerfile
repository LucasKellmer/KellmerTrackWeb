# Fase de Build
FROM ubuntu:latest AS BUILD

# Instalar Node.js e npm
RUN apt-get update
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Instalar Angular CLI globalmente (opcional)
RUN npm install -g @angular/cli

# Criar diretório de trabalho e copiar arquivos
WORKDIR /app
COPY . .

# Instalar dependências e construir a aplicação Angular
RUN npm install
RUN ng build

# Fase de Produção
FROM nginx:alpine

# Copiar a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build do Angular para a pasta padrão do Nginx
COPY --from=BUILD /app/dist/kellmertrackweb/browser /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
