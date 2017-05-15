const express = require('express');
const models = require('../models');
const router = express.Router();

//candidate
router.get('/', (req, res) => {
  models.candidates.findAll().then(candidates => {
    res.json(candidates);
  }).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err);
  });
});

router.post('/', (req, res) => {
  models.candidates.create({
    name: req.body.name
  }).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err);
  });
});


module.exports = router;
