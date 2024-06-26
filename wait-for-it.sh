#!/bin/sh
# wait-for-it.sh: Wait for a service to become available

host=$1
shift
port=$1
shift
cmd="$@"

until nc -z -v -w30 "$host" "$port"
do
  echo "Esperando a que $host:$port esté disponible..."
  sleep 5
done

exec $cmd
