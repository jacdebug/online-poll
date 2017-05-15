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

  sequelize.transaction().then(t => {

    getVoter(req.body.email, t)
      .spread(voter =>  {
        return getVoterCount(voter.id, req.body.poll_id, t)
      })
      .spread(voterCount => {
        if(voterCount.voted < 3) {
          getCandidateTotal(req, t)
            .spread(candidate => updateVote(voterCount, candidate, t))
            .then(result => {
                res.status(201).json({
                  statusText: 'sucess',
                  result: result
                });
                return t.commit();
              })
        }
        else {
          throw('Error more than three times voted !!');
        }
      }).catch(err => {
        res.status(403).json({
          statusText: 'fail',
          err: err
        });
        return t.rollback();
      });

    });

});



//helper fucntions
//TODO: refactor and move to models

function getVoter(email, t) {
  return models.voters.findOrCreate({
    where: { email: email },
    defaults: {},
    transaction: t
  });
}

function getVoterCount(voterId, pollId, t) {
  return models.voters_vote_count.findOrCreate({
    where: {
      polls_id: pollId,
      voters_id: voterId
    },
    defaults: {},
    transaction: t
  });
}

function getCandidateTotal(req, t) {
  return models.polls_candidates_total.findOrCreate({
    where: {
      polls_id: req.body.poll_id,
      candidates_id: req.body.candidate_id
    },
    defaults: {},
    transaction: t
  });
}

function updateVote(voterCount, candidate, t) {
  return Promise.all([
    voterCount.update({
      voted: sequelize.literal('voted +1')
    }, {transaction: t}),
    candidate.update({
      total: sequelize.literal('total +1')
    }, {transaction: t})
  ]);
}

module.exports = router;
