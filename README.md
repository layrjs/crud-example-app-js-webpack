# CRUD Example App

> **This Layr example app is deprecated.**

A simple example showing how to build a full-stack CRUD app with Layr.

## Install

Install the npm dependencies with:

```sh
npm install
```

Make sure you have [Docker](https://www.docker.com/) installed as it is used to run the database (MongoDB) when running the app in development mode.

## Usage

### Running the app in development mode

Execute the following command:

```sh
FRONTEND_URL=http://localhost:16577 \
  BACKEND_URL=http://localhost:16578 \
  MONGODB_STORE_CONNECTION_STRING=mongodb://test:test@localhost:16579/test \
  npm run start
```

The app should then be available at http://localhost:16577.

### Debugging

#### Client

Add the following entry in the local storage of your browser:

```
| Key   | Value     |
| ----- | --------- |
| debug | layr:* |
```

#### Server

Add the following environment variables when starting the app:

```sh
DEBUG=layr:* DEBUG_DEPTH=10
```
