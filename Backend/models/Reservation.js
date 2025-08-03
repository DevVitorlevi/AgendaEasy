const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Schedule = require('./Schedule');

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

// Associações
User.hasMany(Reservation);
Reservation.belongsTo(User);

Schedule.hasOne(Reservation);
Reservation.belongsTo(Schedule);

module.exports = Reservation;
