const express = require('express');
const router = express.Router();
const {
  createReservation,
  getUserReservations,
  getReservationById,
  updateReservation,
  cancelReservation
} = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');

// All reservation routes require authentication
router.use(authMiddleware);

router.post('/', createReservation);
router.get('/', getUserReservations);
router.get('/:id', getReservationById);
router.put('/:id', updateReservation);
router.delete('/:id', cancelReservation);

module.exports = router;
