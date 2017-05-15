module.exports = function(sequelize, DataTypes) {
  return sequelize.define('polls', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    starttime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endtime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'polls'
  });
};
