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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: horarios } = await Schedule.findAndCountAll({
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
      order: [['data', 'ASC'], ['hora', 'ASC']],
      limit,
      offset
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      horarios
    });
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
