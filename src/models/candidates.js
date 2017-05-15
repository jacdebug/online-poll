module.exports = function(sequelize, DataTypes) {
  return sequelize.define('candidates', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'candidates'
  });
};
