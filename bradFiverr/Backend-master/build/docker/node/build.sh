#!/usr/bin/env bash

CWD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
PROJ_ROOT=${CWD}/../../..
cd ${CWD}

#REPO="petruisfan"
REPO=${REGISTRY_ID}
IMAGE="sharemy.tech-rest"
VERSION=0.4

echo "Does the tag $REPO/$IMAGE:$VERSION need updating? [y,N]"

read ANSWER

if [[ ${ANSWER} == 'y' ]]; then
    echo "Update the tag and rerun the command"
    exit 0
fi

cd ${PROJ_ROOT}

docker build -t $REPO/$IMAGE:$VERSION -f build/docker/node/Dockerfile .
[[ $? != 0 ]] && echo "Build image failed " && exit 1;

docker tag $REPO/$IMAGE:$VERSION $REPO/$IMAGE:latest          # add latest tag
[[ $? != 0 ]] && echo "Tag image failed " && exit 2;

echo "Upload $REPO/$IMAGE to amazon registry? [y,N]"

read ANSWER

if [[ ${ANSWER} == 'y' ]]; then
    docker push $REPO/$IMAGE:latest
fi
