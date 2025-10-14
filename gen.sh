#!/usr/bin/env bash
PATH=$PATH:$(pwd)/node_modules/.bin \
    protoc -I third_party/Protobufs/steam/ \
    --es_out src/proto/steam \
    --es_opt target=ts \
    third_party/Protobufs/steam/*.proto