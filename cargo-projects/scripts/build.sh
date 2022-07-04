#!/usr/bin/env bash

if ! options=$(getopt -o '' --long path:,root -- "$@"); then
  echo "ERROR: print usage"
  exit 1
fi

eval set -- "$options"

CHECK=false
while true; do
  case "$1" in
  --path)
    TARGET_PATH=$2
    shift 2
    ;;
  --root)
    CHECK=true
    shift 1
    ;;
  --)
    shift
    break
    ;;
  esac
done

if [[ $CHECK == "true" ]]; then
  cargo run --manifest-path "${TARGET_PATH}/Cargo.toml" > "${TARGET_PATH}/debug" 2>&1
else
  cargo run Cargo.toml 1> out 2> debug
fi