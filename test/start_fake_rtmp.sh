#!/bin/sh

# Listas de parâmetros
DIRECOES="ENTRADA SAIDA"
UNITYIDS="35 42"

# Função para selecionar um item aleatório de uma lista
select_random_item() {
  echo "$1" | tr ' ' '\n' | shuf -n 1
}

# Função para gerar uma imagem aleatória
generate_image() {
  local direcao=$(select_random_item "$DIRECOES")
  local unityid=$(select_random_item "$UNITYIDS")
  local filename="snapshot_${direcao}_${unityid}.jpg"
#   local filename="snapshot.jpg"
  convert -size 250x250 xc: +noise Random "$filename"
  echo "Imagem gerada: $filename"
}

# Função para gerar um intervalo de tempo aleatório entre 1 e 10 segundos
random_sleep() {
  local sleep_time=$((RANDOM % 10 + 1))
  echo "Aguardando por $sleep_time segundos..."
  sleep $sleep_time
}

# Loop principal
while true; do
  generate_image
  random_sleep
done
