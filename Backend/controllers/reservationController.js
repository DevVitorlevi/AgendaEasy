const { Schedule, Reservation, User, Service } = require('../models');

// Cliente faz reserva
exports.createReservation = async (req, res) => {
  const { scheduleId } = req.body;

  if (!scheduleId) {
    return res.status(400).json({ message: 'scheduleId é obrigatório' });
  }

  try {
    const horario = await Schedule.findByPk(scheduleId);

    if (!horario || horario.status === 'reservado') {
      return res.status(400).json({ message: 'Horário não disponível' });
    }

    const reserva = await Reservation.create({
      userId: req.user.id,
      scheduleId,
    });

    await horario.update({ status: 'reservado' });

    res.status(201).json({ message: 'Reserva realizada com sucesso', reserva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar reserva' });
  }
};

// Admin ou cliente vê reservas
exports.getReservations = async (req, res) => {
  try {
    const where = {};
    if (req.user.tipo === 'cliente') {
      where.userId = req.user.id;
    }

    const reservas = await Reservation.findAll({
      where,
      include: [
        {
          model: Schedule,
          include: [
            {
              model: Service,
              as: 'service',
              include: [{ model: User, as: 'profissional', attributes: ['id', 'nome'] }]
            }
          ]
        },
        {
          model: User,
          as: 'cliente',
          attributes: ['id', 'nome', 'email']
        }
      ]
    });

    res.json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar reservas' });
  }
};

// Admin aprova/cancela reserva
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const reserva = await Reservation.findByPk(id, {
      include: [{ model: Schedule }]
    });

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    // Se for cancelada, libera horário
    if (status === 'cancelada') {
      await reserva.Schedule.update({ status: 'disponível' });
    }

    await reserva.update({ status });
    res.json({ message: `Reserva ${status}`, reserva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar reserva' });
  }
};

// Cliente vê apenas suas próprias reservas
exports.getMyReservations = async (req, res) => {
  try {
    const reservas = await Reservation.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Schedule,
          include: [
            {
              model: Service,
              as: 'service',
              include: [{ model: User, as: 'profissional', attributes: ['id', 'nome'] }]
            }
          ]
        }
      ]
    });

    res.json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar suas reservas' });
  }
};
