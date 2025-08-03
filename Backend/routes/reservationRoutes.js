const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware'); // 👈 novo import

// Clientes podem criar reservas
router.post('/', auth, allowRoles('cliente'), reservationController.createReservation);

// Admins podem ver todas as reservas
router.get('/', auth, allowRoles('admin'), reservationController.getReservations);

// Admins podem aprovar, cancelar ou atualizar reservas
router.put('/:id', auth, allowRoles('admin'), reservationController.updateReservation);

module.exports = router;
