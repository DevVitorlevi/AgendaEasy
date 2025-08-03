const Schedule = require('../models/Schedule');

// Admin cria um novo horário
exports.createSchedule = async (req, res) => {
  const { data, hora } = req.body;

  try {
    const novoHorario = await Schedule.create({ data, hora });
    res.status(201).json(novoHorario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar horário' });
  }
};

// Cliente lista horários disponíveis
exports.getAvailableSchedules = async (req, res) => {
  try {
    const horarios = await Schedule.findAll({
      where: { status: 'disponível' },
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
