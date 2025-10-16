#!/usr/bin/env bash
PATH=$PATH:$(pwd)/node_modules/.bin \
    protoc -I third_party/Protobufs/steam/ \
    --es_out src/proto/steam \
    --es_opt target=ts \
    third_party/Protobufs/steam/*.proto

PATH=$PATH:$(pwd)/node_modules/.bin \
    protoc -I third_party/Protobufs/csgo/ \
    --es_out src/proto/csgo \
    --es_opt target=ts \
    third_party/Protobufs/csgo/*gcmessages.proto third_party/Protobufs/csgo/gcsystemmsgs.proto third_party/Protobufs/csgo/steammessages.proto