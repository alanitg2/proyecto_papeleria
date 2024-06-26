# Usar una imagen de Node.js como base
FROM node:14

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["node", "server.js"]
