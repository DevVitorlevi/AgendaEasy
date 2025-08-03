const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');

router.post('/', auth, allowRoles('admin'), serviceController.createService);
router.get('/', auth, serviceController.getServices);
router.put('/:id', auth, allowRoles('admin'), serviceController.updateService);
router.delete('/:id', auth, allowRoles('admin'), serviceController.deleteService);

module.exports = router;
