#!/usr/bin/env bash

if ! options=$(getopt -o '' --long path: -- "$@"); then
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
  --)
    shift
    break
    ;;
  esac
done

if [[ -d "${TARGET_PATH}" ]]; then
  echo "** This lesson is already initiated **"
else
  mkdir -p "${TARGET_PATH}" && cargo init --vcs none "${TARGET_PATH}"
fi