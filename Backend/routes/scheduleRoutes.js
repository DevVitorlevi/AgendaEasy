const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware'); // ⬅️ novo import

// Todos os usuários autenticados podem ver os horários disponíveis
router.get('/', auth, scheduleController.getAvailableSchedules);

// Apenas admins podem criar e remover horários
router.post('/', auth, allowRoles('admin'), scheduleController.createSchedule);
router.delete('/:id', auth, allowRoles('admin'), scheduleController.deleteSchedule);

module.exports = router;
