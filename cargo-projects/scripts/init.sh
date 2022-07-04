#!/usr/bin/env bash

if ! options=$(getopt -o '' --long path:,clean -- "$@"); then
  echo "ERROR: print usage"
  exit 1
fi

eval set -- "$options"

while true; do
  case "$1" in
  --path)
    TARGET_PATH=$2
    shift 2
    ;;
  --clean)
    CLEAN_SIG="true"
    shift 1
    ;;
  --)
    shift
    break
    ;;
  esac
done

if [[ $CLEAN_SIG == "true" ]]; then
  rm -rf "${TARGET_PATH}" && mkdir -p "${TARGET_PATH}" && cargo init --vcs none "${TARGET_PATH}"
  exit 0
fi



if [[ -d "${TARGET_PATH}" ]]; then
  echo "** This lesson is already initiated **"
else
  mkdir -p "${TARGET_PATH}" && cargo init --vcs none "${TARGET_PATH}"
fi