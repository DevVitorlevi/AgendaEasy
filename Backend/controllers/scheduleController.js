const { Schedule, Service, User } = require('../models');

// Admin cria um novo horário vinculado a um serviço
exports.createSchedule = async (req, res) => {
  const { data, hora, serviceId } = req.body;

  if (!serviceId) {
    return res.status(400).json({ message: 'O campo serviceId é obrigatório' });
  }

  try {
    const novoHorario = await Schedule.create({ data, hora, serviceId });
    res.status(201).json(novoHorario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar horário' });
  }
};

// Cliente lista horários disponíveis com detalhes do serviço e profissional
exports.getAvailableSchedules = async (req, res) => {
  try {
    const horarios = await Schedule.findAll({
      where: { status: 'disponível' },
      include: {
        model: Service,
        as: 'service',
        include: {
          model: User,
          as: 'profissional',
          attributes: ['id', 'nome']
        }
      },
      order: [['data', 'ASC'], ['hora', 'ASC']]
    });
    res.json(horarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar horários' });
  }
};

// Admin remove horário
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await Schedule.destroy({ where: { id } });
    res.json({ message: 'Horário removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover horário' });
  }
};
