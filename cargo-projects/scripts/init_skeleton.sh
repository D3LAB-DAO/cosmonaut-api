#!/bin/bash

USER_ID=$1
WHICH_LESSON=$2
WHICH_CHAPTER=$3

PROJ_BASE=/workspace/cargo-projects
BASE_PATH=/workspace/cargo-projects/cosm-base

SKELETON_PATH=${BASE_PATH}/skeleton/lesson${WHICH_LESSON}/chapter${WHICH_CHAPTER}/contracts
USER_CONTRACT_PATH=${PROJ_BASE}/cosm/${USER_ID}/lesson${WHICH_LESSON}/chapter${WHICH_CHAPTER}

if [ -d $SKELETON_PATH ]; then
    mkdir -p ${USER_CONTRACT_PATH}
    cp -r ${SKELETON_PATH} ${USER_CONTRACT_PATH}
    cp -r ${BASE_PATH}/lessons/lesson${WHICH_LESSON}/chapter${WHICH_CHAPTER}/* ${USER_CONTRACT_PATH}
    cp -r ${BASE_PATH}/packages ${USER_CONTRACT_PATH}
else
    echo "Lesson or chapter not found"
fi
