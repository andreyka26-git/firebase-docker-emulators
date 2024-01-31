FROM node:20-bullseye-slim

RUN apt update -y && apt install -y openjdk-11-jdk bash

RUN npm install -g firebase-tools

RUN firebase setup:emulators:firestore
RUN firebase setup:emulators:pubsub

COPY . .

RUN npm --prefix ./functions install

# somehow the docker didn't see entrypoint.sh if I just copy it from the source folder however it does exist when checking with `ls la`
RUN echo '#!/bin/sh \n firebase emulators:start' > ./entrypoint.sh && \
    chmod +x ./entrypoint.sh

ENV FIRESTORE_PORT=8080
ENV FIRESTORE_WS_PORT=5005
ENV UI_PORT=4000
ENV PUBSUB_PORT=8085
ENV FUNCTIONS_PORT=5001

EXPOSE $UI_PORT
EXPOSE $FIRESTORE_PORT
EXPOSE $FIRESTORE_WS_PORT
EXPOSE $PUBSUB_PORT
EXPOSE $FUNCTIONS_PORT

ENTRYPOINT ["./entrypoint.sh"]
