# Development Documentation

## API Docs

API is generated via `swagger`. HTMLified swagger docs can be [seen here](swagger/index.html).

## Linting

Each subproject is configured with `jshint` options, with all Node.js based projects set to use `esversion:6` and `node:true`.

## Node.js

Written and built against the latest Node version, at the time of this writing that is `v6.3.1`. ES6 features including arrow functions, const and let, and template strings are used heavily. Promises are also used where appropriate.

## Requirements

If using docker, then none aside from Docker including `docker-compose`. If developing outside of docker, you'll require a cli webserver (`http-server` on npm is recommended), Node.js and NPM, and Bower. You will also likely desire `swagger`.

## Dependencies

All Dependencies from Node.js are tracked in `package.json` and installable using npm.

All frontend dependencies are tracked in `bower.json` and installable using bower. Socket.io-client library is pulled from API directly, not disk.

## Commands

Each Node.js subproject can be started via `npm start`. Tests for those projects which have them can be run via `npm test`.

## Typescript?

Not deemed useful for this endeavor.
