# Usa la imagen oficial de Node.js como imagen base
FROM node:14

# Crea y cambia al directorio de la aplicación
WORKDIR /usr/src/app

# Copia los archivos de manifiesto de dependencias de la aplicación al contenedor.
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código local al contenedor.
COPY . .

# Exponer el puerto
EXPOSE 3000

# Ejecuta el servicio web al iniciar el contenedor.
CMD [ "node", "server.js" ]
