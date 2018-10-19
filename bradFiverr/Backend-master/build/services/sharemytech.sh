#!/usr/bin/env bash

###############
# SysV Init Information
# description: docker daemon.
### BEGIN INIT INFO
# Provides: sharemy.tech
# Required-Start:
# Required-Stop:
# Default-Start: 2 3 5
# Default-Stop: 0 1 6
# Short-Description: manage docker daemon
# Description: docker daemon
### END INIT INFO


HOME=/opt/sharemy.tech/platform
DOCKER=/usr/bin/docker
DOCKER_COMPOSE=/usr/local/bin/docker-compose
NAME="sharemy-rest"
export COMPOSE_FILE=docker-compose.yml

cd ${HOME}

case "$1" in
    start)
        #todo: parse pids, verify each one is active
        RUNNING=`${DOCKER} inspect -f '{{.State.Running}}' ${NAME} 2> /dev/null`

        if [[ ${RUNNING} == "true" ]]; then
            #
            # No need to start it
            #
            echo "Process is running"
            exit 1;
        else
            echo "Creating '$NAME' container..."
            ${DOCKER_COMPOSE} up -d
        fi
        ;;
    stop)
        echo "Stopping $NAME..."

        ${DOCKER_COMPOSE} stop
#        ${DOCKER_COMPOSE} kill
#        ${DOCKER_COMPOSE} rm --force

        if [[ 0 != $? ]]; then
            echo "Could not stop container"
            exit 4;
        fi
        ;;
    status)
        RUNNING=`${DOCKER} inspect -f '{{.State.Running}}'  ${NAME}`

        if [[ "true" == ${RUNNING} ]]; then
            echo "$NAME is running"
        else
            echo "$NAME is not running"
        fi
        ;;
    inspect)
        ${DOCKER} inspect ${NAME}
        ;;
    logs)
        ${DOCKER_COMPOSE} logs
        ;;
    restart)
        $0 stop
        $0 start
        ;;
    *)
        echo "Please use start, stop, restart, inspect or status as first argument"
        ;;
esac
