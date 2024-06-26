#!/bin/sh

# Espera hasta que el backend esté disponible
until nc -z -v -w30 backend 3000
do
  echo "Esperando a que el backend esté disponible..."
  sleep 5
done

echo "El backend está disponible, iniciando Nginx..."
exec "$@"
