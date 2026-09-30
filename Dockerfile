FROM nginx:alpine

# Copiar configuración de Nginx para escuchar en el puerto 9095
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos de la aplicación
COPY . /usr/share/nginx/html

EXPOSE 9095

CMD ["nginx", "-g", "daemon off;"]
