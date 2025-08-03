// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');

router.post('/', auth,allowRoles('admin'), serviceController.createService); 
router.get('/', auth,allowRoles('cliente'), serviceController.getServices);

module.exports = router;
