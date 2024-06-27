FROM node:18 as build

# Establecemos el directorio de trabajo
WORKDIR /app

COPY proyectofinal/package.json ./proyectofinal/
COPY proyectofinal/package-lock.json ./proyectofinal/

# Instala aqui las dependencias
RUN cd proyectofinal && npm install

# Copia el resto del código de la carpeta proyectofinal
COPY proyectofinal ./proyectofinal

# Construye la aplicación para producción
RUN cd proyectofinal && npm run build --prod
