/*
 * Count up vote route, this route will handle all request for updating vote count
 *
 *  Example payload
 *  {
 *    "poll_id" : "1",
 *    "candidate_id": "1",
 *    "email": "test@test.com"
 *  }
 *
 */


const express = require('express');
const models = require('../models');
const router = express.Router();
const sequelize = models.sequelize;

//add new route
router.post('/', function(req, res) {

  getVoter(req.body.email)
    .spread(voter =>  {
      return getVoterCount(voter.id, req.body.poll_id)
    })
    .spread(voterCount => {

      if(voterCount.voted < 3) {
        getCandidateTotal(req)
          .spread(candidate =>
            sequelize.transaction(updateVote(voterCount, candidate))
          );
      }
      else {
        throw('Error: max limit exceded');
      }

    }).then(result => {
      res.status(201).json({
        statusText: 'sucess',
        result: result
      });

    }).catch(err => {
      res.json({
        statusText: 'fail',
        err: err
      });
    });

});



//helper fucntions
//TODO: refactor and move to models

function getVoter(email) {
  return models.voters.findOrCreate({
    where: { email: email }
  });
}

function getVoterCount(voterId, pollId) {
  return models.voters_vote_count.findOrCreate({
    where: {
      polls_id: pollId,
      voters_id: voterId
    }
  });
}

function getCandidateTotal(req) {
  return models.polls_candidates_total.findOrCreate({
    where: {
      polls_id: req.body.poll_id,
      candidates_id: req.body.candidate_id
    },
  });
}

function updateVote(voterCount, candidate) {
  return function(t) {
    return Promise.all([
      voterCount.update({
        voted: sequelize.literal('voted +1')
      }, {transaction: t}),
      candidate.update({
        total: sequelize.literal('total +1')
      }, {transaction: t})
    ]);
  }
}

module.exports = router;
