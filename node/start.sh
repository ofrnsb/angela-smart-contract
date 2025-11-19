#!/bin/bash

# Script untuk menjalankan node secara lokal

NODE_TYPE=$1
PORT=$2

case $NODE_TYPE in
  bni)
    NODE_ID=node-bni
    BANK_ID=BNI
    PORT=${PORT:-3001}
    PEERS=node-bca,node-merchant
    ;;
  bca)
    NODE_ID=node-bca
    BANK_ID=BCA
    PORT=${PORT:-3002}
    PEERS=node-bni,node-merchant
    ;;
  merchant)
    NODE_ID=node-merchant
    BANK_ID=MERCHANT
    PORT=${PORT:-3003}
    PEERS=node-bni,node-bca
    ;;
  *)
    echo "Usage: ./start.sh [bni|bca|merchant] [port]"
    exit 1
    ;;
esac

export NODE_ID=$NODE_ID
export NODE_TYPE=bank
export BANK_ID=$BANK_ID
export PORT=$PORT
export PEERS=$PEERS

echo "Starting $NODE_ID on port $PORT..."
npm start

