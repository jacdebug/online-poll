const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config.json');

const db = {};
const sequelize = new Sequelize(config.connectionString);

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

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
