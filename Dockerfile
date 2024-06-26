# Etapa 1: Construcción de la aplicación Angular
FROM node:18 as build-angular

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y package-lock.json de Angular
COPY proyectofinal/package*.json ./proyectofinal/

# Instalar las dependencias de Angular
RUN cd proyectofinal && npm install

# Copiar el resto de la aplicación Angular
COPY proyectofinal ./proyectofinal

# Construir la aplicación Angular
RUN cd proyectofinal && npm run build --prod

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build-angular /app/proyectofinal/dist/proyectofinal /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80 para Nginx
EXPOSE 80

# Comando por defecto para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
