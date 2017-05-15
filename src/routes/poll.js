const express = require('express');
const models = require('../models');
const router = express.Router();

//poll
router.get('/', (req, res) => {
  models.polls.findAll().then(polls => {
    res.json(polls);
  }).then(result => {
    res.json(result);
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
