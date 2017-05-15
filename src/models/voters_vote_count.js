module.exports = function(sequelize, DataTypes) {
  return sequelize.define('voters_vote_count', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    voters_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'voters',
        key: 'id'
      }
    },
    polls_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'polls',
        key: 'id'
      }
    },
    voted: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0
    }
  }, {
    tableName: 'voters_vote_count'
  });
};
