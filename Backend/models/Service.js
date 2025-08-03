module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    nome: DataTypes.STRING,
    descricao: DataTypes.TEXT,
    duracao: DataTypes.INTEGER,
    preco: DataTypes.DECIMAL(10, 2)
  });

  Service.associate = (models) => {
    Service.belongsTo(models.User, {
      as: 'profissional',
      foreignKey: 'profissionalId'
    });
    Service.hasMany(models.Schedule, {
      foreignKey: 'serviceId',
      as: 'schedules'
    });
  };

  return Service;
};
