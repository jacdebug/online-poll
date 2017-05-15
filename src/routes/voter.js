const express = require('express');
const models = require('../models');
const router = express.Router();

//voter
router.get('/:email', (req, res) => {
  models.voters.findOne({
    where: { email: req.params.email },
  }).then(voter => {
    res.json(voter);
  }).catch(function (err) {
    res.json(err);
  });
});

router.post('/', (req, res) => {
  models.voters.create({
    email: req.body.email
  }).then(result => {
    res.json(result);
  }).catch(function (err) {
    res.json(err);
  });
});

module.exports = router;
