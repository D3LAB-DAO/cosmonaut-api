#!/bin/bash

USER_ID=$1
WHICH_LESSON=$2
WHICH_CHAPTER=$3

BASE_DIR=/workspace/cargo-projects
BASE_VOLUME_DIR=/workspace/cargo-projects/cosm-base

USER_CONTRACT_DIR=${BASE_DIR}/cosm/${USER_ID}/lesson${WHICH_LESSON}/chapter${WHICH_CHAPTER}

if [ -d $USER_CONTRACT_DIR ]; then 
  docker run --rm \
    -v cosmonaut-api_cosmproj:$BASE_DIR \
    -w /workspace/cargo-projects/cosm/$USER_ID/lesson${WHICH_LESSON}/chapter${WHICH_CHAPTER}
    cosmonaut-contract:1.0.0 cargo run
else
  echo "contract not found"
fi
