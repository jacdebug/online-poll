module.exports = function(sequelize, DataTypes) {
  return sequelize.define('polls_candidates_total', {
    polls_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      references: {
        model: 'polls',
        key: 'id'
      }
    },
    candidates_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'candidates',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'polls_candidates_total'
  });
};
