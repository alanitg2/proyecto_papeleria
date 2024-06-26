# Usar una imagen de Node.js como base
FROM node:14 as build

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación Angular
RUN npm run build --prod

# Usar una imagen de servidor Nginx para servir la aplicación
FROM nginx:alpine
COPY --from=build /app/dist/proyectofinal /usr/share/nginx/html
