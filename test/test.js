const chai = require('chai');
const async = require('async');
const chaiHttp = require('chai-http');
const server = require('../src');
const models = require('../src/models');
const sequelize = models.sequelize;
const should = chai.should();
chai.use(chaiHttp);

// For drop tables and clean start
//sequelize.sync({force: true})

//For each test case we are creating a new poll,
//using below setupdata
const pollSetUpData = {
  title: 'Poll test - mocha',
  candidates: [
    {name: 'A'},
    {name: 'B'},
    {name: 'C'},
    {name: 'D'}
]};

/**
 *  Scenario: Count Me Up should setup new poll
 *  Should create a new poll
 *
 */

describe('Scenario: Count Me Up should setup new poll', () => {

  const setup = chai
    .request(server)
    .post('/api/poll/create')
    .send(pollSetUpData);

  const successResponseTest = (done) => (err, res) => {
    res.should.have.status(201);
    res.body.should.be.a('object');
    if(done) done();
  }

  it('Should create a new poll', (done) => {
    setup.end(successResponseTest(done));
  });

});



/**
 *  Scenario: Count Me Up accepts a vote
 *  Given I am count me up
 *  When I receive a vote for candidate A from voter A
 *  And voter A has not voted before
 *  Then I register that vote and return a 201 response
 *
 */

describe('Scenario: Count Me Up accepts a vote', () => {

  it('Then I register that vote and return a 201 response', (done) => {

    async.waterfall([cb => {

      chai
        .request(server)
        .post('/api/poll/create')
        .send(pollSetUpData)
        .end((err, res) => {
          cb(null, res.body)
        });

    }, body => {

      chai
        .request(server)
        .post('/api/poll/up')
        .send({
          poll_id : body.result.id,
          candidate_id: body.candidatesIds[0],
          email: 'chai@mocha.dev'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          if(done) done();
        });

    }]);

  });

});

/**
 *  Scenario: Count Me Up only accepts 3 votes per user
 *  Given I am count me up
 *  And I have received 3 votes for candidate A from voter B
 *  When I receive a vote for candidate A from voter b
 *  Then I return a 403 response
 *  And I do not register that vote
 *
 */

describe('Scenario: Count Me Up only accepts 3 votes per user', () => {

  const vote = (body, cb) => {
    chai
      .request(server)
      .post('/api/poll/up')
      .send({
        poll_id : body.result.id,
        candidate_id: body.candidatesIds[0],
        email: 'chai@mocha.dev'
      })
      .end(() => {
        cb(null, body);
      });
  }

  it('Should return 403 when I am trying to register for 4th time', (done) => {

    async.waterfall([cb => { //create new poll
      chai
        .request(server)
        .post('/api/poll/create')
        .send(pollSetUpData)
        .end((err, res) => {
          cb(null, res.body)
        });
    },

    vote, //first vote
    vote, //second vote
    vote, //third vote

    (body) => { //fourth vote

      chai
        .request(server)
        .post('/api/poll/up')
        .send({
          poll_id : body.result.id,
          candidate_id: body.candidatesIds[0],
          email: 'chai@mocha.dev'
        })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          if(done) done();
        });

    }]);

  });

});


/**
 *  Scenario: Count Me Up only accepts 3 votes per user regardless of candidate
 *  Given I am count me up
 *  And I have received 2 votes for candidate A from voter B
 *  And I have received 1 vote for candidate D from voter B
 *  When I receive a vote for candidate D from voter B
 *  Then I return a 403 response
 *  And I do not register that vote
 *
 */

describe('Scenario: Count Me Up only accepts 3 votes per user regardless of candidate', () => {

  const vote = index => (body, cb) => {
    chai
      .request(server)
      .post('/api/poll/up')
      .send({
        poll_id : body.result.id,
        candidate_id: body.candidatesIds[index],
        email: 'chai@mocha.dev'
      })
      .end(() => {
        cb(null, body);
      });
  }

  it('Should return 403 when I am trying to register for 4th time regardless of candidate', (done) => {

    async.waterfall([cb => { //create new poll
      chai
        .request(server)
        .post('/api/poll/create')
        .send(pollSetUpData)
        .end((err, res) => {
          cb(null, res.body)
        });
    },

    vote(0), //first vote to first candidate
    vote(1), //second vote to second candidate
    vote(2), //third vote to third candidate

    (body) => { //fourth vote

      chai
        .request(server)
        .post('/api/poll/up')
        .send({
          poll_id : body.result.id,
          candidate_id: body.candidatesIds[0],
          email: 'chai@mocha.dev'
        })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          if(done) done();
        });

    }]);

  });

});


/**
 *  Scenario: Count Me Up returns the voting results
 *  Given I am count me up
 *  And I have received 20,000,000 votes for 4 candidates
 *  And the votes are split:
 *  | candidate   |    votes   |
 *  |    A        |  8,000,000 |
 *  |    B        |  2,000,000 |
 *  |    C        |  6,000,000 |
 *  |    D        |  4,000,000 |
 *
 *  When I receive a request for the overall result
 *  Then I return the correct result
 *  And the response time is under 1 second
 *
 */

describe('Scenario: Count Me Up returns the voting results', () => {

  const NO_OF_REQ = 15;

  it('Should retrun poll data', (done) => {

    async.waterfall([cb => { //create new poll
      chai
        .request(server)
        .post('/api/poll/create')
        .send(pollSetUpData)
        .end((err, res) => {
          cb(null, res.body)
        });
    },

    (body, cb) => {

      //req array
      const requests = [];

      const vote = (payload) =>
        chai
          .request(server)
          .post('/api/poll/up')
          .send(payload);

      //crate a random email for each request
      const randomEmail = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz1234567890_';
        let string = '';
        for(let i=0; i<15; i++) {
          string += chars[Math.floor(Math.random() * chars.length)];
        }
        return `${string}@loadtest.dev`;
      }

      //create n promise
      for(let i = 0; i < NO_OF_REQ; i++) {
        const cid = Math.floor(Math.random() * 4);
        const req = vote({
          poll_id : body.result.id,
          candidate_id: body.candidatesIds[cid],
          email: randomEmail()
        });
        requests.push(req);
      }

      //callback after req completed
      Promise.all(requests).then(() => cb(null, body));

    },

    (body) => {

      chai
        .request(server)
        .get(`/api/poll/${body.result.id}`)
        .end((err, res) => {

          res.body.should.be.a('array');
          const t = res.body.reduce((a,b) => ( { total: a.total + b.total } ) );
          t.total.should.equal(NO_OF_REQ);

          //just to check logs
          console.log(`Total votes: ${t.total}`);
          console.log(['Candidates Id, Total']);
          console.log(res.body.map(ele => `${ele.candidates_id} - ${ele.total}`));

          if(done) done();
        });

    }]);

  });

});
