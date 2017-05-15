module.exports = function(sequelize, DataTypes) {
  return sequelize.define('voters', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'voters'
  });
};
