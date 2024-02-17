# common-firebase-emulator

It is just docker file that can build basic emulators: auth, firestore.
To access ui: https://localhost:4000

# firebase-function

## How to run emulator inside the docker

This repo represents the `Dockerfile` with `docker.compose.yml` which will run `functions`, `firestore`, `auth` and `pubsub` alltogether in docker.

So fork repo, add your functions to `functions` folder, and run `docker compose up -d` or `docker-compose up -d`

Use `https://localhost:4000` to access emulator UI.

For functions unfortunatly you need to build docker locally because functions are packed during the build inside the container.

P.S.

I hope that Google eventually will set some official docker image, because it was nightmare to get piece by piece and make it work. Couple of days spent.

## How to set up, test functions

Inside the repo you might see `functions` folder, it contains code related to firebase functions.

There is alread simple http function `handleRequest` that just logs `text` query parameters. After your container is up - you can access it by navigating to
`http://localhost:5001/dummy-project/us-central1/handleRequest?text=%22qqqqqqqqqqqq%22`

`dummy-project` - is the project id you have set in `.firebaserc` file. I guess this needed for metadata.

`us-central1` - region where you want your function to run, I put us-central as example. It does not matter it will be execute on your localhost

`handleRequest` is a function name defined in the functions js file.

Actually I was not able to see function logs from emulator ui, so you could just use logs from docker container:
`docker logs <container id>`

```
firebase-emulator  | i  functions: Beginning execution of "us-central1-handleRequest"
firebase-emulator  | >  [handleRequest] running inside the http method
firebase-emulator  | >  "qqqqqqqqqqqq"
firebase-emulator  | i  functions: Finished "us-central1-handleRequest" in 2.881127ms
```

## How to modify functions and redeploy

In case you would like to change function behavior it will not automatically pick up your changes.

So for that you would need to rebuild the image and start container again with new image

`docker compose up -d --build` or `docker-compose up -d --build`
