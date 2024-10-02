# install dependencies and devDependencies
FROM node:lts AS prebuild
WORKDIR /home/app
COPY ["package.json", "package-lock.json", "/home/app/"]
RUN npm ci --ignore-scripts

# build for production
FROM node:lts AS build
WORKDIR /home/app
ENV NODE_ENV="production"
# it has package.json, package-lock.json and node_modules/
COPY --from=prebuild /home/app .
# let's build
COPY ["tsconfig.production.json", "/home/app/"]
COPY ["src/", "/home/app/src/"]
RUN npm run build-production

# install only dependencies
FROM node:lts AS deps
WORKDIR /home/app
ENV NODE_ENV="production"
COPY ["package.json", "package-lock.json", "/home/app/"]
RUN npm ci --ignore-scripts

# complete docker image
FROM node:20.17.0-alpine3.20
ENV APP_DIR=/app
# make user and home dir
RUN addgroup -S -g 1001 ndxbn && \
    adduser -S -D -h $APP_DIR -s /sbin/nologin -G ndxbn -u 1001 ndxbn
USER ndxbn
WORKDIR $APP_DIR
# make application directories
RUN mkdir -p config storage
COPY --from=build --chown=ndxbn /home/app/lib/ lib/
COPY --from=deps --chown=ndxbn  /home/app/node_modules/ node_modules/
COPY --from=deps --chown=ndxbn  /home/app/package.json .
COPY --chown=ndxbn config/default.yaml config/

EXPOSE 8000
ENTRYPOINT ["npm", "start"]
