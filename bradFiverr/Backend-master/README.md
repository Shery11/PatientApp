# platform
General repository for ShareMy.tech platform

## Instructions for deploying
1. git commit+push on master branch
2. ssh vps
```
cd /opt/sharemytech/platform
```
3. git pull

## General setup

After cloning the repository:
- install docker
- install docker-compose
- build the docker image:

```
> cd build/docker/node
> ./build.sh
```

- install node dependencies

```
> ./run npm
```

- run:

```
> cd /opt/sharemytech/platform
> ./run server
```

## Run as linux daemon:
- Copy _build/services/sharemy.tech_ to /etc/init.d
- run:
```
> sudo service sharemy.tech start
```

## Source code:

The file: ```src/routes/routes.js``` contains all api endpoints.

For example the endpoint
```
> app.post(`${v}/asset`, jsonParser, authorize, asset.create);
```
- responds to a POST request
- takes the body as a json
- needs authorization (request from a logged in user)
- use the ```asset.create``` method ( which can be found in ```src/routes/asset.js``` )
