#!/usr/bin/env bash

if ! options=$(getopt -o '' --long path:,check -- "$@"); then
  echo "ERROR: print usage"
  exit 1
fi

eval set -- "$options"

CLIPPY=false
while true; do
  case "$1" in
  --path)
    TARGET_PATH=$2
    shift 2
    ;;
  --check)
    echo -e "** Use Clippy to catch common mistakes **\n"
    CLIPPY=true
    shift 1
    ;;
  --)
    shift
    break
    ;;
  esac
done

if [[ $CLIPPY == "true" ]]; then
  cargo clippy --manifest-path "${TARGET_PATH}/Cargo.toml" 2>&1
else
  cargo run --manifest-path "${TARGET_PATH}/Cargo.toml" 2>&1
fi