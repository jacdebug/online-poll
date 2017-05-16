Online Poll
==================================
Easy and quick online poll api in nodejs

## Prerequisite

- Nodejs, not an ancient one please, soruce code uses some es6 and not using a transpiler, tested on v7.7.1. Use [nvm](https://github.com/creationix/nvm) if you want to rum multiple version of nodejs.
- [MySQL](https://www.mysql.com/downloads/)
- git client for sure

## Usage

1. Create a database on your database sever.
2. `git clone  https://github.com/deepak-jacob/online-poll.git`
2. Edit [src/config.json](src/config.json) and set you connection string.
4. `npm install`

Happy to help, raise an issue if you are facing any difficulty please.

## Helpful commands

- `npm start`
- `npm test`
- `npm run dev`
- `npm run tdd`

## API Doc

- `/api/poll/create` - for creating new poll
- `/api/poll/up` - for casting a vote
- `/api/poll/:poll_id` - for results

Jump into [test/test.js](test/test.js) for detailed infomantion on how to use api.

## Tooling

- `express` - most simple and minimal web framework
- `sequelizejs` - a promise-based ORM for Node.js v4 and up. It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL and features solid transaction support, relations, read replication and more.
- `ES6`
- `mocha and chai` - for test
- `mysql` - dev did on mysql but you can you any `sequelizejs` supported database without any changes.

## TODO

- Check and refine the data returned each calls
- Starttime and endtime checking
- Send mail and validate each vote.
- Implement a redis queue to handle millions of request and process votes from that queue.
- Finish all restful api's
- More test
- Use vagrant for easy dev env setup
- Deployment helpers, dockerize, etc

## Contribution

Feature request and PRs welcome.


License
-------

MIT
