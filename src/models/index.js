const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config.json');

const db = {};
const sequelize = new Sequelize(config.connectionString, { logging: false });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('') !== false) && (file !== 'index.js')
  })
  .forEach(file => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.polls.hasMany(db.polls_candidates_total, {foreignKey: 'polls_id'});
db.polls_candidates_total.belongsTo(db.polls, {foreignKey: 'polls_id'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sync all models that aren't already in the database
sequelize.sync();

module.exports = db;
