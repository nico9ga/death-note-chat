# Usamos una imagen base de Node para construir la aplicación
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias primero para aprovechar la caché de Docker
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm ci

# Copiamos el resto de los archivos del proyecto
COPY . .

# Construimos la aplicación para producción
RUN npm run build

# Usamos una imagen ligera de Nginx para servir la aplicación
FROM nginx:alpine

# Copiamos los archivos construidos desde la etapa anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Exponemos el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]