const { Schedule, Reservation, User, Service } = require('../models');
const AuditLog = require('../models/AuditLog'); // Corrigi nome do arquivo para AuditLog

// Cliente faz reserva
exports.createReservation = async (req, res) => {
  const { scheduleId } = req.body;

  if (!scheduleId) {
    return res.status(400).json({ message: 'scheduleId é obrigatório' });
  }

  try {
    const horario = await Schedule.findByPk(scheduleId, {
      include: { model: Service, as: 'service' }
    });

    if (!horario || horario.status === 'reservado') {
      return res.status(400).json({ message: 'Horário não disponível' });
    }

    // Validar se usuário já tem reserva no mesmo dia, hora e serviço
    const existing = await Reservation.findOne({
      where: { userId: req.user.id },
      include: [{
        model: Schedule,
        where: {
          data: horario.data,
          hora: horario.hora,
          serviceId: horario.serviceId
        }
      }]
    });

    if (existing) {
      return res.status(400).json({ message: 'Você já tem uma reserva para esse serviço, dia e horário.' });
    }

    const reserva = await Reservation.create({
      userId: req.user.id,
      scheduleId,
    });

    await horario.update({ status: 'reservado' });

    // Criar log de auditoria
    await AuditLog.create({
      userId: req.user.id,
      action: 'Criou reserva',
      details: `Reserva ID: ${reserva.id}, Schedule ID: ${scheduleId}`
    });

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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: reservas } = await Reservation.findAndCountAll({
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
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      reservas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar reservas' });
  }
};

// Admin aprova/cancela reserva
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { status, motivoRecusa } = req.body;

  try {
    const reserva = await Reservation.findByPk(id, { include: Schedule });

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    // Cliente só pode cancelar sua própria reserva
    if (req.user.tipo === 'cliente') {
      if (reserva.userId !== req.user.id) {
        return res.status(403).json({ message: 'Não autorizado' });
      }
      if (status !== 'cancelada') {
        return res.status(400).json({ message: 'Clientes só podem cancelar reservas' });
      }
      await reserva.Schedule.update({ status: 'disponível' });
      await reserva.update({ status, motivoRecusa: null });

      // Log de auditoria
      await AuditLog.create({
        userId: req.user.id,
        action: 'Cancelou reserva',
        details: `Reserva ID: ${reserva.id}`
      });

      return res.json({ message: 'Reserva cancelada com sucesso', reserva });
    }

    // Admin pode aprovar ou cancelar e informar motivo da recusa
    if (req.user.tipo === 'admin') {
      if (status === 'cancelada') {
        await reserva.Schedule.update({ status: 'disponível' });
      }
      await reserva.update({ status, motivoRecusa: status === 'cancelada' ? motivoRecusa : null });

      // Log de auditoria
      await AuditLog.create({
        userId: req.user.id,
        action: `Atualizou reserva para ${status}`,
        details: `Reserva ID: ${reserva.id}${motivoRecusa ? ', Motivo: ' + motivoRecusa : ''}`
      });

      return res.json({ message: `Reserva ${status}`, reserva });
    }

    res.status(403).json({ message: 'Não autorizado' });

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
