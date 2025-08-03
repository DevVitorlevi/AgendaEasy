module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('disponível', 'reservado'),
      defaultValue: 'disponível',
    },
  }, {
    tableName: 'schedules',
    timestamps: true,
  });

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Service, {
      foreignKey: 'serviceId',
      as: 'service',
    });
  };

  return Schedule;
};
