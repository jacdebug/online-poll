process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src');
const models = require('../src/models');
const sequelize = models.sequelize;

const should = chai.should();
chai.use(chaiHttp);

describe('Scenario: Count Me Up accepts a vote', () => {

  let pollId, canIds;

  describe('Setup a new poll', () => {
    it('When I receive a vote for candidate A from voter A', (done) => {

      chai.request(server)
          .post('/api/poll/create')
          .send({
              "title": "Poll test A",
              "candidates": [
                { "name": "A"},
                { "name": "B"},
                { "name": "C"},
                { "name": "D"}
            ]})
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('new poll created');
            res.body.should.have.property('result');
            pollId = res.body.result.id;
            canIds = res.body.candidatesIds;
            done();
          });

    });
  });

  describe('Given I am count me up', () => {
    it('When I receive a vote for candidate A from voter A', (done) => {

      chai.request(server)
          .post('/api/poll/up')
          .send({
            "poll_id" : pollId,
            "candidate_id": canIds[0],
            "email": "test11@test-nodomain.com"
          })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            done();
          });

    });
  });

});

/*
describe('Scenario: Count Me Up only accepts 3 votes per user', () => {

  describe('And I have received 3 votes for candidate A from voter B', () => {
    it('Then I return a 403 response', (done) => {

      chai.request(server)
          .post('/api/poll/up')
          .send({
            "poll_id" : "1",
            "candidate_id": "1",
            "email": "vaoterA@test-nodomain.com"
          })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });

      //And I do not register that vote

    });
  });

});


describe('Scenario: Count Me Up only accepts 3 votes per user regardless of candidate', () => {

  describe('Given I am count me up ', () => {
    it('And I have received 2 votes for candidate A from voter B', (done) => {

      //And I have received 1 vote for candidate D from voter B
      //When I receive a vote for candidate D from voter B
      //Then I return a 403 response
      //And I do not register that vote

      chai.request(server)
          .post('/api/poll/up')
          .send({
            "poll_id" : "1",
            "candidate_id": "1",
            "email": "vaoterA@test-nodomain.com"
          })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });

      //And I do not register that vote

    });
  });

});







/*


Scenario: Count Me Up returns the voting results
Given I am count me up
And I have received 20,000,000 votes for 4 candidates
And the votes are split:
| candidate   |    votes   |
|    A        |  8,000,000 |
|    B        |  2,000,000 |
|    C        |  6,000,000 |
|    D        |  4,000,000 |

When I receive a request for the overall result
Then I return the correct result
And the response time is under 1 second




*/
