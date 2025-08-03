const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');

router.post('/', auth, allowRoles('cliente'), reservationController.createReservation);
router.get('/minhas-reservas', auth, allowRoles('cliente'), reservationController.getMyReservations);
router.get('/', auth, allowRoles('admin'), reservationController.getReservations); // para admin ver todas
router.put('/:id', auth, allowRoles('admin'), reservationController.updateReservation);

module.exports = router;
