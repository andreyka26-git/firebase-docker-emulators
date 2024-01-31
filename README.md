# firebase-docker-emulators


This repo represents the Dockerfile with docker.compose.yml which will run functions, firestore, auth and pubsub alltogether in docker.

So fork repo, add your functions to `functions` folder, and run `docker compose up -d`

`https://localhost:4000` for emulator UI.

Later I will publish to dockerhub if you need only firestore and auth for example.
For functions unfortunatly you need to build docker locally because functions are packed during the build inside the continer.

P.S.
I hope that Google eventually will set some official docker image, because it was nightmare to get piece by piece and make it work. Couple of days spent.
