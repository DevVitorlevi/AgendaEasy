module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'aprovada', 'cancelada'),
      defaultValue: 'pendente',
    }
  }, {
    tableName: 'reservations',
    timestamps: true,
  });

  Reservation.associate = (models) => {
    Reservation.belongsTo(models.User, { foreignKey: 'userId', as: 'cliente' });
    Reservation.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
  };

  return Reservation;
};
    