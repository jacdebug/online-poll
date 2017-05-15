/*
 * Add new poll and candidates
 *
 * Example payload
 *
 *   {
 *     "title": "poll b",
 *     "starttime": "2017-05-15 00:00:00",
 *     "endtime": "2017-05-15 12:00:00",
 *     "candidates": [
 *       { "name": "A"},
 *       { "name": "B"},
 *       { "name": "C"}
 *     ]
 *   }
 *
 */

const express = require('express');
const models = require('../models');
const router = express.Router();

router.post('/', function(req, res) {

  const promisesCandidates = req.body.candidates
    .map(candidate => models.candidates
    .create({
      name: candidate.name
    }));

  Promise.all(promisesCandidates).then(candidates => {
    let candidatesIds = candidates.map(c => c.id);

    models.polls.create({
      title: req.body.title,
      starttime: req.body.starttime,
      endtime: req.body.endtime
    }).then(result => {

      const promises = candidatesIds.map(id =>
        models.polls_candidates_total.create({
          polls_id: result.id,
          candidates_id: id,
          total: 0
        })
      );

       Promise.all(promises).then(() => {
        res.json({
          'message': 'new poll created'
        });
       });

    }).catch(function (err) {
      console.log(err);
    });

  });

});

module.exports = router;
