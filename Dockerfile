# Usa la imagen oficial de Node.js como imagen base
FROM node:18 as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json desde la carpeta proyectofinal
COPY proyectofinal/package.json ./proyectofinal/
COPY proyectofinal/package-lock.json ./proyectofinal/

# Instala las dependencias
RUN cd proyectofinal && npm install

# Copia el resto del código de la carpeta proyectofinal
COPY proyectofinal ./proyectofinal

# Construye la aplicación para producción
RUN cd proyectofinal && npm run build --prod

# Usa una imagen base de Nginx para servir el contenido
FROM nginx:alpine

# Copia los archivos de construcción al directorio de Nginx
COPY --from=build /app/proyectofinal/dist/proyectofinal /usr/share/nginx/html

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar Nginx con una variable de entorno
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
