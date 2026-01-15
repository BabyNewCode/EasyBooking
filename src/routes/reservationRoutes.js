const express = require('express');
const authenticate = require('../middleware/authenticate');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

router.post('/', authenticate, reservationController.createReservation);
router.get('/', authenticate, reservationController.getMyReservations);
router.get('/:id', authenticate, reservationController.getReservationById);
router.put('/:id/cancel', authenticate, reservationController.cancelReservation);

module.exports = router;
