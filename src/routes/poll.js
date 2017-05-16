const express = require('express');
const models = require('../models');
const router = express.Router();

//poll
router.get('/:id', (req, res) => {
  models.sequelize.query(`
    SELECT * FROM polls
    LEFT JOIN  polls_candidates_total ON polls_candidates_total.polls_id = polls.id
    LEFT JOIN  candidates ON candidates.id = polls_candidates_total.candidates_id
    where polls.id = ?`,
    { replacements: [req.params.id], type: models.sequelize.QueryTypes.SELECT }
  ).then(polls => {
    res.json(polls);
  }).catch(err => {
    res.json(err);
  });
});

router.post('/', (req, res) => {
  models.polls.create({
    title: req.body.title
  }).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err);
  });
});

module.exports = router;
