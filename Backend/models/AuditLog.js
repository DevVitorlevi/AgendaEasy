const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: { // quem fez a ação
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: { // tipo de ação: 'cancelou reserva', 'aprovou reserva', etc
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: { // texto livre com detalhes da ação
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
});

module.exports = AuditLog;
